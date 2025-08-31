import { GlobalConfig } from '@/configs/types';
import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private s3: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    const awsConfig = this.configService.get<GlobalConfig['aws']>('aws');
    if (!awsConfig) {
      throw new Error('AWS configuration not found');
    }

    this.s3 = new S3Client({
      region: awsConfig.region,
      endpoint: awsConfig.endpoint,
      forcePathStyle: !!awsConfig.endpoint,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });

    this.bucket = awsConfig.bucket;
  }

  /**
   * Upload a file buffer to S3 and return the generated key.
   */
  async uploadFile(
    file: Express.Multer.File,
    folder = 'uploads/',
  ): Promise<string> {
    const safeName = file.originalname
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_.-]/g, '');
    const key = `${folder}${safeName}`;

    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: file.size,
    });

    try {
      await this.s3.send(cmd);
      return key;
    } catch (err) {
      this.logger.error('S3 upload error', err);
      throw new InternalServerErrorException('Failed to upload file to S3');
    }
  }

  /**
   * Generate a presigned GET URL for a key.
   */
  async getPresignedUrl(key: string, expiresInSeconds = 60): Promise<string> {
    const cmd = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      const url = await getSignedUrl(this.s3, cmd, {
        expiresIn: expiresInSeconds,
      });
      return url;
    } catch (err) {
      this.logger.error('S3 presign error', err);
      throw new InternalServerErrorException(
        'Failed to generate presigned URL',
      );
    }
  }

  /**
   * List objects under a prefix. Returns simplified metadata.
   */
  async listFiles(
    prefix = 'uploads/',
  ): Promise<Array<{ key: string; lastModified?: string; size?: number }>> {
    try {
      const out = await this.s3.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
        }),
      );

      return (out.Contents ?? [])
        .map((item) => ({
          key: item.Key!,
          lastModified: item.LastModified?.toISOString(),
          size: item.Size,
        }))
        .sort((a, b) => {
          const dateA = a.lastModified ? new Date(a.lastModified).getTime() : 0;
          const dateB = b.lastModified ? new Date(b.lastModified).getTime() : 0;
          return dateB - dateA; // Descending order (newest first)
        });
    } catch (err) {
      this.logger.error('S3 list error', err);
      throw new InternalServerErrorException('Failed to list files from S3');
    }
  }
}
