import { BASE_URL } from "../constants/baseUrl";
import { LoginCredentials, LoginResponse } from "../types/auth";

class AuthService {
  private readonly baseUrl = BASE_URL;

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    return data;
  }

  logout(): void {
    localStorage.removeItem("access_token");
  }

  getToken(): string | null {
    return localStorage.getItem("access_token");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();
