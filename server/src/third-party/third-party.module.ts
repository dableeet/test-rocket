import { Module, forwardRef } from '@nestjs/common';
import { ThirdPartyService } from './third-party.service';
import { FsWorkerModule } from 'src/fs-worker/fs-worker.module';

@Module({
  imports: [forwardRef(() => FsWorkerModule)],
  providers: [ThirdPartyService],
  exports: [ThirdPartyService],
})
export class ThirdPartyModule {}
