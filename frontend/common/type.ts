export enum UserRole {
  User = "User",
  Admin = "Admin",
  SuperAdmin = "SuperAdmin",
}

export class ICoreEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface ICoreOutput {
  ok: boolean;
  error?: string;
}
export interface IPaginationInput {
  "page-size": number;
  page: number;
  type?: string;
  value?: string;
}

export interface IFormSearchInput {
  type: string;
  value: string;
}

export interface IPaginationOutput extends ICoreOutput {
  totalPage: number;
  totalResult?: number;
  searchType?: string;
  searchValue?: string;
  result?: any;
}

export interface IUser extends ICoreEntity {
  role: UserRole;
  email: string;
  nickname: string;
  password?: string;
  phone?: string;
}

export interface IExam extends ICoreEntity {
  userId: number;
  user?: IUser;
  description: string;
  title?: string;
  time: number;
  minimumPassScore: number;
}

export interface IQuestion {
  examId: number;
  page: number;
  text: string;
  score: number;
}

export interface IFindQuestionsByExamIdOutput extends ICoreOutput {
  questions?: IQuestion[];
}

export interface IUserInput {
  id: number;
  email: string;
  nickname: string;
  password: string;
}

export interface ISignupUserInput {
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
  minimumPassScore: number;
}

export interface IFindExamsByMeOutput extends ICoreOutput {
  exams?: any[];
}

export interface IFindQuestionsByExamIdInput {
  examId: number;
}

export interface IFindMultipleChoicesByExamIdOutput extends ICoreOutput {
  multipleChoices?: any[];
}

export interface IEditExamInput {
  id: number;
  description: string;
  title: string;
  time: number;
  minimumPassScore: number;
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

export interface IDeleteMultipleChoicesInput {
  examId: number;
  page: number;
}

export interface IDeleteExamPageInput {
  examId: number;
  page: number;
}
