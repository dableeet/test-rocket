import * as fs from 'node:fs/promises';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  forwardRef,
} from '@nestjs/common';

import { ThirdPartyService } from 'src/third-party/third-party.service';

@Injectable()
export class FsWorkerService implements OnApplicationBootstrap {
  constructor(
    @Inject(forwardRef(() => ThirdPartyService))
    private thirdPartyService: ThirdPartyService,
  ) {}

  async onApplicationBootstrap() {
    const rl = readline.createInterface(input, output);
    try {
      const getTokens = await rl.question(
        'Выполнить получение токенов? (y/n): ',
      );

      if (getTokens.toLowerCase() === 'y') {
        await this.createTokenStorage();

        const tokens =
          await this.thirdPartyService.requestTokens('authorization_code');

        await fs.writeFile('./tokens/tokens.json', JSON.stringify(tokens));
      }

      await this.thirdPartyService.setProperties();
    } catch (error) {
      console.log(error);
    }
  }

  private async createTokenStorage() {
    try {
      await fs.mkdir('./tokens');
    } catch (error) {
      console.log('./tokens уже существует');
    }
  }

  async updateTokens(tokens) {
    await fs.writeFile('./tokens/tokens.json', JSON.stringify(tokens));
  }
}
