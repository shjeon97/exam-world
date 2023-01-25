import { useMutation, useQuery } from "react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { ICoreOutput } from "../../../../common/type";
import { Toast } from "../../../../lib/sweetalert2/toast";
import { FormButton } from "../../FormButton";
import { FormError } from "../../FormError";
import { apiCreateExamComment, apiGetMe } from "../../../../api/axios";

export const CreateExamCommentForm = ({ examId }) => {
  const [text, setText] = useState("");
  const { isLoading: meIsLoading, data: meData } = useQuery("me", apiGetMe);

  let router = useRouter();
  const createExamCommentMutation = useMutation(apiCreateExamComment, {
    onSuccess: async (data: ICoreOutput) => {
      if (data.ok) {
        await Toast.fire({
          icon: "success",
          title: `커멘트가 저장 되었습니다.`,
          position: "top-end",
          timer: 1000,
        });
        router.reload();
      }
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!createExamCommentMutation.isLoading) {
      if (text.length < 5) {
        alert("내용을 입력해 주세요.");
      } else {
        createExamCommentMutation.mutate({
          text,
          examId,
          userId: meData.id,
        });
      }
    }
  };
  const handleSetText = (e) => {
    setText(e.target.value);
  };

  if (!meIsLoading && !meData) {
    return <div>로그인 후 댓글 작성 가능합니다. </div>;
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          댓글 작성
        </label>
        <textarea
          value={text}
          placeholder={"댓글 작성..."}
          onChange={(e) => handleSetText(e)}
          rows={4}
          className="resize-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        ></textarea>

        <br />
      </div>
      <FormButton
        canClick={meData && text.length > 5}
        loading={createExamCommentMutation.isLoading}
        actionText={"작성"}
      />
      {createExamCommentMutation?.data?.error && (
        <FormError errorMessage={createExamCommentMutation.data.error} />
      )}
    </form>
  );
};
