import classNames from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { apiGetMe, apiSendQuestion } from "../api/axios";
import { ICoreOutput, ISendQuestionInput, IUserInput } from "../common/type";
import { FormButton } from "../components/forms/form-button";
import { FormError } from "../components/forms/form-error";
import Tiptap from "../components/tiptap";
import { WEB_TITLE } from "../constant";
import { Toast } from "../lib/sweetalert2/toast";

const Qna = () => {
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<ISendQuestionInput>({ mode: "onChange" });
  const { isLoading: meIsLoading, data: meData } = useQuery<IUserInput>(
    "me",
    apiGetMe
  );
  const [tiptapValue, setTiptapValue] = useState("");

  const tiptapEditor = (editor: any) => {
    if (editor) {
      setTiptapValue(editor.getHTML());
    }
  };
  let router = useRouter();

  const sendQuestionMutation = useMutation(apiSendQuestion, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Toast.fire({
          icon: "success",
          title: `문의사항이 접수 되었습니다.`,
          position: "top-end",
          timer: 3000,
        });
        router.push("/");
      }
    },
  });

  const registerOption = {
    email: { required: "사용할 이메일 입력해 주세요." },
    question: { required: "문의 내용을 입력해 주세요." },
  };

  const onSubmit = () => {
    if (!sendQuestionMutation.isLoading) {
      if (tiptapValue.length < 10) {
        alert("문의 내용을 입력해 주세요.");
      } else {
        const sendQuestion = getValues();
        sendQuestion.question = tiptapValue;

        sendQuestionMutation.mutate(sendQuestion);
      }
    }
  };

  return (
    <>
      <Head>
        <title className=" text-gray-800">문의사항 {WEB_TITLE}</title>
      </Head>
      <div className="p-10  m-5">
        <div className="flex flex-col items-center">
          <h1 className="mb-2 font-medium text-2xl ">문의사항</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="text-lg font-medium">이메일</label>
            <div className=" text-xs  text-gray-500">
              문의사항에 관한 답변받을 이메일 정보를 입력하세요.
            </div>
            <input
              type={"email"}
              className={classNames(`form-input`, {
                "border-red-500 focus:border-red-500 focus:outline-red-500":
                  errors.email,
              })}
              {...register("email", registerOption.email)}
              placeholder="이메일"
            />

            <div>
              <label className="text-lg font-medium">내용</label>
              <Tiptap editor={tiptapEditor} />
            </div>
            {Object.values(errors).length > 0 &&
              Object.values(errors).map((error, key) => {
                return (
                  <div key={`form_error_${key}`}>
                    <FormError errorMessage={`${error.message}`} />
                    <br />
                  </div>
                );
              })}
            <div className="mt-2">
              <FormButton
                canClick={isValid}
                loading={false}
                actionText={"전송"}
              />
            </div>
            {sendQuestionMutation?.data?.error && (
              <FormError errorMessage={sendQuestionMutation.data.error} />
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Qna;
