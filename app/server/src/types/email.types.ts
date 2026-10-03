export interface Email {
  receiver: string;
  subject: string;
  body: string;
}

export interface VerifyEmailParams {
  token: string;
}
