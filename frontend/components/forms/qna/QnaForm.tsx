import { useForm } from "react-hook-form";
import { FormButton } from "../FormButton";
import { useMutation } from "react-query";
import { apiSendQuestion } from "../../../api/axios";
import { ICoreOutput, ISendQuestionInput } from "../../../common/type";
import { FormError } from "../FormError";
import { useRouter } from "next/router";
import { Toast } from "../../../lib/sweetalert2/toast";
import { QnaEmailField } from "./fields/QnaEmailField";
import { useState } from "react";
import Tiptap from "../../Tiptap";
export const QnaForm = () => {
  const [tiptapValue, setTiptapValue] = useState("");
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<ISendQuestionInput>({ mode: "onChange" });
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

  const tiptapEditor = (editor: any) => {
    if (editor) {
      setTiptapValue(editor.getHTML());
    }
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <QnaEmailField register={register} error={errors.email} />
      <div>
        <label className="text-lg font-medium">내용</label>
        <Tiptap editor={tiptapEditor} />
        <br />
      </div>
      <FormButton
        canClick={isValid}
        loading={sendQuestionMutation.isLoading}
        actionText={"문의내용 접수"}
      />
      {sendQuestionMutation?.data?.error && (
        <FormError errorMessage={sendQuestionMutation.data.error} />
      )}
    </form>
  );
};
