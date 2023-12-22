import { Injectable } from '@nestjs/common';
import { ThirdPartyService } from 'src/third-party/third-party.service';

@Injectable()
export class LeadsService {
  constructor(private thirdPartyService: ThirdPartyService) {}

  getAllEntries() {
    return this.thirdPartyService.findEntries();
  }

  getEntriesWithFilter(filter: string) {
    return this.thirdPartyService.findEntries(filter);
  }
}
