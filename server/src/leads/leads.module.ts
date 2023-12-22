import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { ThirdPartyModule } from 'src/third-party/third-party.module';

@Module({
  imports: [ThirdPartyModule],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
