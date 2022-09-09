import axios from "axios";
import { ISignupUserInput } from "../type";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SEVER_BASE_URL + "/api";

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
