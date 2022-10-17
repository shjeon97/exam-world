import classNames from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { apiCreateExam, apiGetMe } from "../../api/axios";
import {
  ICreateExamInput,
  ICreateExamOutput,
  IUserInput,
} from "../../common/type";
import { CreateExamForm } from "../../components/forms/exam/create/CreateExamForm";
import { FormButton } from "../../components/forms/FormButton";
import { FormError } from "../../components/forms/FormError";
import { WEB_TITLE } from "../../constant";
import { Toast } from "../../lib/sweetalert2/toast";

export default function CreateExam() {
  const {
    register: createExamRegister,
    getValues: createExamGetValues,
    formState: { errors: createExamErrors, isValid: createExamIsValid },
    handleSubmit: createExamHandleSubmit,
  } = useForm<ICreateExamInput>({ mode: "onChange" });

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
      showClass: {
        popup: "none",
      },
      hideClass: {
        popup: " animate__fadeOutUp",
      },
    });
    router.push("/login");
  }

  return (
    <div>
      <Head>
        <title className=" text-gray-800">시험 만들기 {WEB_TITLE}</title>
      </Head>
      <div className="p-10  m-5">
        <div className="flex flex-col items-center">
          <h1 className="mb-2 font-medium text-2xl ">시험 만들기</h1>
          <CreateExamForm />
        </div>
      </div>
    </div>
  );
}
