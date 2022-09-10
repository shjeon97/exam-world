import axios from "axios";
import { JwtToken } from "../../constant";
import { ILoginInput, ISignupUserInput } from "../type";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SEVER_BASE_URL + "/api";
axios.defaults.withCredentials = true; // withCredentials 전역 설정
axios.defaults.headers["Authorization"] = JwtToken();

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
