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
  ISignupUserInput,
  IUploadImageInput,
} from "../common/type";

axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_SEVER_BASE_URL}/api`;

axios.defaults.withCredentials = true;
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = JwtToken() ? `Bearer ${JwtToken()}` : "";

  return config;
});

export const apiSignupUser = async ({
  email,
  name,
  password,
}: ISignupUserInput) => {
  return axios
    .post(`/auth/signup`, {
      email,
      name,
      password,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

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

export const apiCreateQuestion = async ({
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

export const apiCreateMultipleChoice = async ({
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

export const apiEditMe = async ({
  email,
  password,
  name,
  editPassword,
}: IEditMeInput) => {
  return axios
    .patch("/user/me", {
      email,
      password,
      name,
      editPassword,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiEditExam = async ({ id, name, title }: IEditExamInput) => {
  return axios
    .patch("/exam", {
      id,
      name,
      title,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

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

export const apiCreateExam = async ({ name, title }: ICreateExamInput) => {
  return axios
    .post("/exam", {
      name,
      title,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
