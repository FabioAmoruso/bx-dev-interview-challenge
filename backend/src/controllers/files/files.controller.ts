import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '@/constants/files';
import { UploadResponseDto } from '@/dtos/files/upload-response.dto';
import { FilesService } from '@/services/files/files.service';
import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

const memoryStorage = multer.memoryStorage();

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * POST /api/files/upload
   * body: multipart/form-data with "file"
   */
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided under "file" field');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }
    const key = await this.filesService.uploadFile(file);
    const url = await this.filesService.getPresignedUrl(key, 60);

    return { key, url };
  }

  /**
   * GET /api/files
   */
  @Get()
  async list(@Query('prefix') prefix?: string) {
    return this.filesService.listFiles(prefix ?? 'uploads/');
  }

  /**
   * GET /api/files/url?key=...
   * returns a presigned URL for download
   */
  @Get('url')
  async getUrl(
    @Query('key') key?: string,
    @Query('expiresIn') expiresIn?: string,
  ) {
    if (!key) {
      throw new BadRequestException('Missing "key" query parameter');
    }
    const seconds = expiresIn ? parseInt(expiresIn, 10) : 60;
    const url = await this.filesService.getPresignedUrl(key, seconds);
    return { url };
  }
}
