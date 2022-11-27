import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { apiVerifyEmail } from "../../api/axios";
import { useMe } from "../../hooks/useMe";
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
  useMe();

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
