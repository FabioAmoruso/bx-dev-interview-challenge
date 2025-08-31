import { FileItem, PresignedUrlResponse, UploadResponse } from "../types/files";

export class FilesService {
  private baseUrl = "/api/files";

  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upload failed: ${error}`);
    }

    return response.json();
  }

  async listFiles(prefix?: string): Promise<FileItem[]> {
    const params = new URLSearchParams();
    if (prefix) {
      params.append("prefix", prefix);
    }

    const response = await fetch(`${this.baseUrl}?${params.toString()}`);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to list files: ${error}`);
    }

    return response.json();
  }

  async getDownloadUrl(key: string, expiresIn?: number): Promise<string> {
    const params = new URLSearchParams({ key });
    if (expiresIn) {
      params.append("expiresIn", expiresIn.toString());
    }

    const response = await fetch(`${this.baseUrl}/url?${params.toString()}`);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get download URL: ${error}`);
    }

    const data: PresignedUrlResponse = await response.json();
    return data.url;
  }
}
