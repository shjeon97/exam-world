export interface IUserInput {
  email: string;
  name: string;
  password: string;
}

export interface ISignupUserInput extends IUserInput {}

export interface IEditMeInput extends IUserInput {
  editPassword?: string;
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

export interface IDeleteMeInput {
  password: string;
}
