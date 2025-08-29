import { IsString, IsUrl } from 'class-validator';

export class UploadResponseDto {
  @IsString()
  key!: string;

  @IsUrl()
  url!: string;
}
