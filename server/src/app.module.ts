import { Module } from '@nestjs/common';

import { LeadsModule } from './leads/leads.module';
import { ThirdPartyModule } from './third-party/third-party.module';

import configuration from './config/auth.configuration';
import { ConfigModule } from '@nestjs/config';
import { FsWorkerModule } from './fs-worker/fs-worker.module';

@Module({
  imports: [
    LeadsModule,
    ThirdPartyModule,
    FsWorkerModule,
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
  ],
})
export class AppModule {}
