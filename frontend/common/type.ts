export interface IUserInput {
  id: number;
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

export interface ICreateExamOutput extends ICoreOutput {
  examId?: number;
}

export interface IDeleteMeInput {
  password: string;
}

export interface IUploadImageInput {
  file: any;
}

export interface IUploadImageOutput extends ICoreOutput {
  fileURL?: any;
}

export interface ISendQuestionInput {
  email: string;
  question: any;
}

export interface ICreateExamInput {
  name: string;
  title: string;
}

export interface IFindExamListByMeOutput extends ICoreOutput {
  examList?: any[];
}

export interface IFindQuestionListByExamIdInput {
  examId: number;
}

export interface IFindQuestionListByExamIdOutput extends ICoreOutput {
  questionList?: any[];
}
