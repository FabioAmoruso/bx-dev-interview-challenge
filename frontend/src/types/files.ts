export type UploadResponse = {
  key: string;
  url: string;
};

export type FileItem = {
  key: string;
  lastModified?: string;
  size?: number;
};

export type PresignedUrlResponse = {
  url: string;
};
