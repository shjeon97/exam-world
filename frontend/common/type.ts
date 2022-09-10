export interface ISignupUserInput {
  email: string;
  name: string;
  password: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface ICoreOutput {
  ok: boolean;
  error?: string;
}

export interface ILoginOutput extends ICoreOutput {
  token?: string;
}
