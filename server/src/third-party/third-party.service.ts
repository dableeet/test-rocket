import axios, { Axios } from 'axios';

import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FsWorkerService } from 'src/fs-worker/fs-worker.service';

type RequestParams = {
  url: string;
  code: string;
  body: {
    client_id: string;
    client_secret: string;
    redirect_uri: string;
  };
};

type Tokens = {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
  received_at: number;
};

@Injectable()
export class ThirdPartyService {
  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => FsWorkerService))
    private fsWorkerService: FsWorkerService,
  ) {}

  private tokens: Tokens;

  private axiosInstanse: Axios;

  private requestParams =
    this.configService.get<RequestParams>('requestParams');

  async requestTokens(grant_type: 'authorization_code' | 'refresh_token') {
    const isAuthRequest = grant_type === 'authorization_code';

    const codeKey = isAuthRequest ? 'code' : 'refresh_token';

    const codeValue = isAuthRequest
      ? this.requestParams.code
      : this.tokens.refresh_token;

    try {
      const response = await axios.post(
        `${this.requestParams.url}/oauth2/access_token`,
        {
          ...this.requestParams.body,
          grant_type,
          [codeKey]: codeValue,
        },
      );

      const received_at = Math.floor(Date.now() / 1000);

      return { ...response.data, received_at };
    } catch (error) {
      console.log(error);
    }
  }

  private tokenIsExpired() {
    const currentTime = Math.floor(Date.now() / 1000);

    const isExpired =
      this.tokens.received_at + this.tokens.expires_in <= currentTime;

    return isExpired;
  }

  async setProperties() {
    await this.setTokens('../../tokens/tokens.json');
    this.setAxiosInstanse();
  }

  private async setTokens(path: string) {
    this.tokens = await import(path);
  }

  private setAxiosInstanse() {
    this.axiosInstanse = axios.create({
      headers: {
        Authorization: `${this.tokens.token_type} ${this.tokens.access_token}`,
      },
    });
  }

  private generateApiEndpoint(filterValue: string | undefined) {
    return !filterValue
      ? `${this.requestParams.url}/api/v4/leads?with=contacts`
      : `${this.requestParams.url}/api/v4/leads?with=contacts&query=${filterValue}`;
  }

  private async getAdditionalData(
    data,
    dataType: 'leadStatus' | 'responsibileUser' | 'contacts',
  ) {
    try {
      let additional: any;

      if (dataType === 'responsibileUser') {
        additional = await this.axiosInstanse.get(
          `${this.requestParams.url}/api/v4/users/${data.responsible_user_id}`,
        );
      }

      if (dataType === 'leadStatus') {
        additional = await this.axiosInstanse.get(
          `${this.requestParams.url}/api/v4/leads/pipelines/${data.pipeline_id}/statuses/${data.status_id}`,
        );
      }

      if (dataType === 'contacts') {
        additional = await this.axiosInstanse.get(
          `${this.requestParams.url}/api/v4/contacts/${data.id}`,
        );
      }

      return additional.data;
    } catch (error) {
      console.log(error);
    }
  }

  private async filterApiData(data) {
    try {
      const filteredData = await Promise.all(
        data._embedded.leads.map(async (lead) => {
          try {
            const responsibileUser = await this.getAdditionalData(
              lead,
              'responsibileUser',
            );

            const status = await this.getAdditionalData(lead, 'leadStatus');

            const contacts = await Promise.all(
              lead._embedded.contacts.map(async (contact) => {
                const contactData = await this.getAdditionalData(
                  contact,
                  'contacts',
                );

                return {
                  name: contactData.name,
                  contacts: contactData.custom_fields_values.map(
                    (metaPersonContact) => ({
                      type: metaPersonContact.field_code,
                      values: metaPersonContact.values,
                    }),
                  ),
                };
              }),
            );

            const createdAt = new Date(lead.created_at * 1000)
              .toLocaleString('ru', { timeStyle: 'short', dateStyle: 'short' })
              .split(',')
              .join('');

            return {
              id: lead.id,
              name: lead.name,
              price: lead.price,
              responsibileUser: responsibileUser.name,
              leadStatus: { name: status.name, color: status.color },
              children: contacts,
              createdAt,
            };
          } catch (error) {
            console.log(error);
          }
        }),
      );

      return filteredData;
    } catch (error) {
      console.log(error);
    }
  }

  async findEntries(nameFilter?: string) {
    try {
      if (this.tokenIsExpired()) {
        await this.refreshTokens();
      }

      const apiEndpoint = this.generateApiEndpoint(nameFilter);

      const { data: leadsData } = await this.axiosInstanse.get(apiEndpoint);

      if (!leadsData) {
        return 'not found';
      }

      return this.filterApiData(leadsData);
    } catch (error) {
      console.log(error);
    }
  }

  private async refreshTokens() {
    try {
      const tokens = await this.requestTokens('refresh_token');

      await this.fsWorkerService.updateTokens(tokens);

      await this.setProperties();
    } catch (error) {
      // console.log(error);
    }
  }
}
