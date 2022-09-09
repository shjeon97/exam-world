import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import classnames from "classnames";
import { useMutation } from "react-query";
import { ICoreOutput, ISignupUserInput } from "../common/type";
import { apiSignupUser } from "../common/api/axios";
import Swal from "sweetalert2";
import { Toast } from "../lib/sweetalert2/toast";
import { title } from "process";

const Signup = () => {
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<ISignupUserInput>({ mode: "onChange" });

  const signupUserMutation = useMutation(apiSignupUser, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Toast.fire({
          icon: "success",
          title: "회원가입 완료되었습니다.",
          position: "top-end",
        });
      } else if (!data.ok && data.error) {
        Toast.fire({
          icon: "error",
          title: data.error,
        });
      }
    },
  });

  const onSubmit = () => {
    if (!signupUserMutation.isLoading) {
      const signupUser = getValues();
      signupUserMutation.mutate(signupUser);
    }
  };

  const registerOption = {
    email: { required: "사용할 이메일 입력해 주세요." },
    name: {
      required: "사용할 닉네임을 입력해 주세요.",
      minLength: {
        value: 4,
        message: "닉네임은 4자리 이상 10자리 이하여야 합니다.",
      },
      maxLength: {
        value: 10,
        message: "닉네임은 4자리 이상 10자리 이하여야 합니다.",
      },
    },
    password: {
      required: "사용할 비밀번호를 입력해 주세요.",
      minLength: {
        value: 4,
        message: "비밀번호는 4자리 이상이여야 합니다.",
      },
    },
  };

  return (
    <div className=" bg-white">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className=" w-10/12 mx-auto md:w-96">
          <h1 className="mb-2 text-lg font-medium">회원가입</h1>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type={"email"}
                className={classnames(
                  `w-full p-2 my-1 duration-200 border border-gray-400 rounded bg-gray-50 focus:bg-white hover:bg-white`,
                  { "border-red-500 focus:border-red-500": errors.email }
                )}
                {...register("email", registerOption.email)}
                placeholder="이메일"
              />

              <input
                className={classnames(
                  `w-full p-2 my-1 duration-200 border border-gray-400 rounded bg-gray-50 focus:bg-white hover:bg-white`,
                  { "border-red-500 focus:border-red-500": errors.name }
                )}
                {...register("name", registerOption.name)}
                placeholder="닉네임"
              />

              <input
                type={"password"}
                className={classnames(
                  `w-full p-2 my-1 duration-200 border border-gray-400 rounded bg-gray-50 focus:bg-white hover:bg-white`,
                  { "border-red-500 focus:border-red-500": errors.password }
                )}
                {...register("password", registerOption.password)}
                placeholder="비밀번호"
              />

              {Object.values(errors).length > 0 &&
                Object.values(errors).map((error, key) => {
                  return (
                    <div key={`error_${key}`}>
                      <FormError errorMessage={error.message} />
                      <br />
                    </div>
                  );
                })}
              <button className="w-full py-2 mb-1 text-sm font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded hover:bg-gray-500">
                회원가입
              </button>
            </form>

            <small>
              이미 가입하셨나요?
              <Link href="/login">
                <a className="ml-1 text-blue-500 uppercase ">로그인</a>
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
