export interface IUserInput {
  id: number;
  email: string;
  nickname: string;
  password: string;
}

export interface IRegisterUserInput {
  email: string;
  nickname: string;
  password: string;
}

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
  time: number;
}

export interface IFindExamListByMeOutput extends ICoreOutput {
  examList?: any[];
}

export interface IAllExamListOutput extends ICoreOutput {
  examList?: any[];
}

export interface IFindQuestionListByExamIdInput {
  examId: number;
}

export interface IFindQuestionListByExamIdOutput extends ICoreOutput {
  questionList?: any[];
}

export interface IFindMultipleChoiceListByExamIdOutput extends ICoreOutput {
  multipleChoiceList?: any[];
}

export interface IEditExamInput {
  id: number;
  name: string;
  title: string;
  time: number;
}

export interface ICreateQuestionInput {
  examId: number;
  page: number;
  text: string;
  score: number;
}

export interface ICreateMultipleChoiceInput {
  examId: number;
  no: number;
  text: string;
  isCorrectAnswer: number;
  page: number;
}

export interface IDeleteMultipleChoiceListInput {
  examId: number;
  page: number;
}

export interface IDeleteExamPageInput {
  examId: number;
  page: number;
}
