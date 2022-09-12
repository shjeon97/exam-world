import axios from "axios";
import { JwtToken } from "../../constant";
import {
  IDeleteMeInput,
  IEditMeInput,
  ILoginInput,
  ISignupUserInput,
} from "../type";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SEVER_BASE_URL + "/api";
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
