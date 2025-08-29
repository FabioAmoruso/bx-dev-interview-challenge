import { FilesController } from '@/controllers/files/files.controller';
import { FilesService } from '@/services/files/files.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
