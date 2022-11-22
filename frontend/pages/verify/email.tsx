import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { apiGetMe, apiVerifyEmail } from "../../api/axios";
import { IUserInput } from "../../common/type";
import { Toast } from "../../lib/sweetalert2/toast";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const { code } = query;
  return {
    props: {
      code,
    },
  };
};

export default function Email({ code }: { code: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isLoading: meIsLoading, data: meData } = useQuery<IUserInput>(
    "me",
    apiGetMe
  );
  if (!meIsLoading && !meData) {
    Toast.fire({
      icon: "error",
      title: `유저 정보를 찾지 못하였습니다. 다시 로그인 해주세요.`,
      position: "top-end",
      timer: 3000,
    });
    router.push("/login");
  }

  const verifyEmailMutation = useMutation(apiVerifyEmail, {
    onSuccess: async (data) => {
      if (data.ok) {
        await Toast.fire({
          icon: "success",
          text: "이메일 인증완료.",
          position: "top-end",
          timer: 1200,
        });
        queryClient.invalidateQueries([`me`]);
        router.push("/");
      } else if (!data.ok && data.error) {
        await Toast.fire({
          icon: "error",
          text: data.error,
          timer: 1200,
        });
      }
    },
  });

  useEffect(() => {
    verifyEmailMutation.mutate(code);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <h2 className=" text-xl font-medium">Confirming email...</h2>
      <h4 className=" text-gray-700 text-lg">
        Please wait, don't close this page...
      </h4>
    </div>
  );
}
