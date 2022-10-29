import axios from "axios";
import { JwtToken } from "../constant";
import {
  ICreateExamInput,
  ICreateMultipleChoiceInput,
  ICreateQuestionInput,
  IDeleteMeInput,
  IEditExamInput,
  IEditMeInput,
  ILoginInput,
  ISendQuestionInput,
  IRegisterUserInput,
  IUploadImageInput,
  IDeleteMultipleChoiceListInput,
  IPaginationInput,
} from "../common/type";

axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_SEVER_BASE_URL}/api`;

axios.defaults.withCredentials = true;
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = JwtToken() ? `Bearer ${JwtToken()}` : "";

  return config;
});

// 회원가입
export const apiRegisterUser = async ({
  email,
  nickname,
  password,
}: IRegisterUserInput) => {
  return axios
    .post(`/auth/register`, {
      email,
      nickname,
      password,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// 로그인
export const apiLogin = async ({ email, password }: ILoginInput) => {
  return axios
    .post("/auth/login", {
      email,
      password,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// 질문 저장 (생성,변경)
export const apiSaveQuestion = async ({
  examId,
  page,
  text,
  score,
}: ICreateQuestionInput) => {
  return axios
    .post("/question", {
      examId,
      page,
      text,
      score,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// 보기 저장 (생성,변경)
export const apiSaveMultipleChoice = async ({
  examId,
  no,
  text,
  isCorrectAnswer,
  page,
}: ICreateMultipleChoiceInput) => {
  return axios
    .post("/multiple-choice", {
      examId,
      no,
      text,
      isCorrectAnswer,
      page,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// 유저 정보 수정
export const apiEditMe = async ({
  email,
  password,
  nickname,
  editPassword,
}: IEditMeInput) => {
  return axios
    .patch("/user/me", {
      email,
      password,
      nickname,
      editPassword,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// 시험 정보 수정
export const apiEditExam = async ({
  id,
  name,
  title,
  time,
  minimumPassScore,
}: IEditExamInput) => {
  return axios
    .patch("/exam", {
      id,
      name,
      title,
      time: +time,
      minimumPassScore: +minimumPassScore,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// 계정 삭제
export const apiDeleteMe = async ({ password }: IDeleteMeInput) => {
  return axios
    .delete("/user/me", {
      data: {
        password,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// 보기 리스트 삭제
export const apiDeleteMultipleChoiceList = async ({
  examId,
  page,
}: IDeleteMultipleChoiceListInput) => {
  return axios
    .delete("/multiple-choice", {
      data: {
        examId,
        page,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiSearchExam = async ({
  pageSize,
  page,
  searchType,
  searchValue,
}: IPaginationInput) => {
  return axios
    .get(
      `${
        searchType && searchValue
          ? `exam/search?pagesize=${pageSize}&page=${page}&searchType=${searchType}&searchValue=${searchValue}`
          : `exam/search?pagesize=${pageSize}&page=${page}`
      }`
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// 시험 삭제 (문제, 보기 포함)
export const apiDeleteExam = async (id: number) => {
  return axios
    .delete(`exam/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// 시험 마지막 페이지 삭제 (문제, 보기)
export const apiDeleteExamLastPage = async (id: number) => {
  return axios
    .delete(`exam/${id}/last-page`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// 내 정보
export const apiGetMe = async () => {
  return axios
    .get("user/me")
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// 모든 시험 정보 가져오기 (추후 인피니티 스크롤로 변경 예정)
export const apiAllExamList = async () => {
  return axios
    .get("exam/all")
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// 내가 만든 시험 정보 가져오기 (추후 인피니티 스크롤로 변경 예정))
export const apiFindExamListByMe = async () => {
  return axios
    .get("exam/me")
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// 시험과 관련된 문제 정보 가져오기
export const apiFindQuestionListByExamId = async (examId: number) => {
  if (examId) {
    return axios
      .get(`exam/${examId}/question`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

// 시험과 관련된 보기 정보 가져오기
export const apiFindMultipleChoiceListByExamId = async (examId: number) => {
  if (examId) {
    return axios
      .get(`exam/${examId}/multiple-choice`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

// 시험 정보 가져오기
export const apiFindExamById = async (id: number) => {
  if (id) {
    return axios
      .get(`exam/${id}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

// 이미지 업로드
export const apiUploadImage = async ({ file }: IUploadImageInput) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios
    .post(`/image`, formData)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// 문의사항 전송
export const apiSendQuestion = async ({
  email,
  question,
}: ISendQuestionInput) => {
  return axios
    .post("/qna/question", {
      email,
      question,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// 시험 생성
export const apiCreateExam = async ({
  name,
  title,
  time,
  minimumPassScore,
}: ICreateExamInput) => {
  return axios
    .post("/exam", {
      name,
      title,
      time: +time,
      minimumPassScore: +minimumPassScore,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
