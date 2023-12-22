import { Module, forwardRef } from '@nestjs/common';
import { FsWorkerService } from './fs-worker.service';
import { ThirdPartyModule } from 'src/third-party/third-party.module';

@Module({
  imports: [forwardRef(() => ThirdPartyModule)],
  providers: [FsWorkerService],
  exports: [FsWorkerService],
})
export class FsWorkerModule {}
