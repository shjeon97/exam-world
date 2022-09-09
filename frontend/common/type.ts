export interface ISignupUserInput {
  email: string;
  name: string;
  password: string;
}

export interface ICoreOutput {
  ok: boolean;
  error?: string;
}
