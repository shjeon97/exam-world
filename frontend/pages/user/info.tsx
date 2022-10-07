import classnames from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import { apiDeleteMe, apiEditMe, apiGetMe } from "../../api/axios";
import { ICoreOutput, IEditMeInput, IUserInput } from "../../common/type";
import { FormButton } from "../../components/forms/form-button";
import { FormError } from "../../components/forms/form-error";
import { WEB_TITLE } from "../../constant";
import { Toast } from "../../lib/sweetalert2/toast";

const Info = () => {
  const {
    register,
    getValues,
    setValue,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IEditMeInput>({ mode: "onChange" });
  const queryClient = useQueryClient();

  const [editPasswordCheck, setEditPasswordCheck] = useState<boolean>(false);
  const editMeMutation = useMutation(apiEditMe, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Toast.fire({
          icon: "success",
          title: `정보 수정완료!`,
          position: "top-end",
          timer: 2000,
        });
        queryClient.invalidateQueries("me");
      }
    },
  });

  const deleteMeMutation = useMutation(apiDeleteMe, {
    onSuccess: async (data: ICoreOutput) => {
      if (data) {
        await Toast.fire({
          icon: "success",
          title: `탈퇴가 완료되었습니다.`,
          position: "top-end",
          timer: 3000,
        });
        queryClient.invalidateQueries("me");
      }
    },
  });

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
      required: "비밀번호를 입력해 주세요.",
    },
    editPassword: {
      minLength: {
        value: 4,
        message: "비밀번호는 4자리 이상이여야 합니다.",
      },
    },
  };
  const { isLoading: meIsLoading, data: meData } = useQuery<IUserInput>(
    "me",
    apiGetMe
  );
  let router = useRouter();

  if (!meIsLoading && !meData) {
    Toast.fire({
      icon: "error",
      title: `유저 정보를 찾지 못하였습니다. 다시 로그인 해주세요.`,
      position: "top-end",
      timer: 3000,
    });
    router.push("/login");
  }

  const onSubmit = () => {
    if (!editPasswordCheck) {
      setValue("editPassword", null);
    }
    if (!editMeMutation.isLoading) {
      const editUser = getValues();
      editMeMutation.mutate(editUser);
    }
  };

  const handleDeletUser = () => {
    Swal.fire({
      title: "Are you sure?",
      html: "정말 탈퇴하기를 원하십니까? <br> 탈퇴 후 기존 모든 정보는 복구가 불가능합니다.",
      icon: "warning",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "탈퇴하기",
      showCancelButton: true,
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMeMutation.mutate({ password: getValues().password });
      }
    });
  };
  return (
    <>
      <Head>
        <title className=" text-gray-600">내 정보 {WEB_TITLE}</title>
      </Head>
      {!meIsLoading && meData && (
        <>
          <div className="p-10  m-5">
            <div className="flex flex-col items-center">
              <h1 className="mb-2 font-medium text-2xl ">내 정보</h1>
              <div>
                <form className=" max-w-sm" onSubmit={handleSubmit(onSubmit)}>
                  <label className="text-sm font-medium">이메일</label>
                  <input
                    type={"email"}
                    className={classnames(`form-input`, {
                      "border-red-500 focus:border-red-500 focus:outline-red-500":
                        errors.email,
                    })}
                    {...register("email", registerOption.email)}
                    placeholder="이메일"
                    defaultValue={meData.email}
                  />
                  <label className="text-sm font-medium">닉네임</label>

                  <input
                    className={classnames(`form-input`, {
                      "border-red-500 focus:border-red-500 focus:outline-red-500":
                        errors.name,
                    })}
                    {...register("name", registerOption.name)}
                    placeholder="닉네임"
                    defaultValue={meData.name}
                  />
                  <label className="text-sm font-medium">비밀번호</label>
                  <div className=" text-xs  text-gray-500">
                    정보를 변경 및 탈퇴하려면 현재 비밀번호를 입력하세요.
                  </div>
                  <input
                    type={"password"}
                    className={classnames(`form-input`, {
                      "border-red-500 focus:border-red-500 focus:outline-red-500":
                        errors.password,
                    })}
                    {...register("password", registerOption.password)}
                    placeholder="비밀번호"
                  />
                  <label className="text-sm font-medium">
                    <input
                      type="checkbox"
                      name="color"
                      value="blue"
                      checked={editPasswordCheck}
                      onChange={(e) => setEditPasswordCheck(e.target.checked)}
                    />{" "}
                    비밀번호 변경
                  </label>
                  <div className=" text-xs  text-gray-500">
                    변경할 비밀번호를 입력하세요.
                  </div>
                  <input
                    type={"password"}
                    className={classnames(`form-input`, {
                      "pointer-events-none": !editPasswordCheck,
                      "border-red-500 focus:border-red-500 focus:outline-red-500":
                        errors.editPassword,
                    })}
                    {...register("editPassword", registerOption.editPassword)}
                    placeholder="비밀번호"
                  />
                  {Object.values(errors).length > 0 &&
                    Object.values(errors).map((error, key) => {
                      return (
                        <div key={`form_error_${key}`}>
                          <FormError errorMessage={error.message} />
                          <br />
                        </div>
                      );
                    })}
                  <div className=" grid grid-cols-2 gap-4">
                    <FormButton
                      canClick={isValid}
                      loading={false}
                      actionText={"정보 수정"}
                    />

                    <div
                      className={classnames(
                        `hover:cursor-pointer text-center bg-red-600 hover:bg-red-500  w-full select-none font-medium focus:outline-none text-white py-2  transition-colors rounded`,
                        {
                          " pointer-events-none bg-gray-400":
                            !getValues().password,
                        }
                      )}
                      onClick={() => handleDeletUser()}
                    >
                      탈퇴하기
                    </div>
                  </div>
                  {editMeMutation?.data?.error && (
                    <FormError errorMessage={editMeMutation.data.error} />
                  )}
                  {deleteMeMutation?.data?.error && (
                    <FormError errorMessage={deleteMeMutation.data.error} />
                  )}
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Info;
