import { BASE_URL } from "../constants/baseUrl";
import { FileItem, PresignedUrlResponse, UploadResponse } from "../types/files";
import authService from "./auth.service";

export class FilesService {
  private readonly baseUrl = `${BASE_URL}/files`;

  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const token = authService.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: "POST",
      headers,
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

    const token = authService.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
      headers,
    });

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

    const token = authService.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}/url?${params.toString()}`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get download URL: ${error}`);
    }

    const data: PresignedUrlResponse = await response.json();
    return data.url;
  }

  async deleteFile(key: string): Promise<void> {
    const token = authService.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${this.baseUrl}?key=${encodeURIComponent(key)}`,
      {
        method: "DELETE",
        headers,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete file: ${error}`);
    }
  }
}
