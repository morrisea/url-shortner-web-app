export interface RegisterRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponseBody {
  message: string;
  data?: JSON | null;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginResponseBody {
  message: string;
  accessToken?: string;
}
