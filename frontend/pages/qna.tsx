import classNames from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { apiGetMe, apiSendQuestion } from "../api/axios";
import { ICoreOutput, ISendQuestionInput, IUserInput } from "../common/type";
import { FormButton } from "../components/forms/FormButton";
import { FormError } from "../components/forms/FormError";
import { QnaForm } from "../components/forms/qna/QnaForm";
import Tiptap from "../components/Tiptap";
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
          <QnaForm />
        </div>
      </div>
    </>
  );
};

export default Qna;
