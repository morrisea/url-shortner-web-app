export interface RegisterRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponseBody {
  message: string;
  email?: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginResponseBody {
  message: string;
  accessToken?: string;
  email?: string;
}

export interface AuthToken {
  id: number;
  email: string;
  first: string;
  last: string;
  iat?: number;
  exp?: number;
}
