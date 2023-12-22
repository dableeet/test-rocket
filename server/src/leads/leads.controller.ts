import { Controller, Get, Query } from '@nestjs/common';
import { LeadsService } from './leads.service';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  entries(@Query('searchFilter') searchFilter: string) {
    if (!searchFilter) {
      return this.leadsService.getAllEntries();
    }

    return this.leadsService.getEntriesWithFilter(searchFilter);
  }
}
