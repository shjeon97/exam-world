import classNames from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import {
  apiCreateExam,
  apiFindQuestionListByExamId,
  apiGetMe,
} from "../../api/axios";
import {
  ICoreOutput,
  ICreateExamInput,
  ICreateExamOutput,
  IFindQuestionListByExamIdInput,
  IFindQuestionListByExamIdOutput,
  IUserInput,
} from "../../common/type";
import { FormButton } from "../../components/form-button";
import { FormError } from "../../components/form-error";
import Tiptap from "../../components/tiptap";
import { WEB_TITLE } from "../../constant";
import { Toast } from "../../lib/sweetalert2/toast";

export default function CreateExam() {
  const [isExam, setisExam] = useState<boolean>(false);
  const [tiptapValue, setTiptapValue] = useState("");
  const [questionList, setQuestionList] = useState([]);
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
    });
    router.push("/login");
  }
  const createExamRegisterOption = {
    name: { required: "사용할 제목 입력해 주세요." },
    title: { required: "사용할 설명 입력해 주세요." },
  };

  const findQuestionListByExamIdMutation = useMutation(
    apiFindQuestionListByExamId,
    {
      onSuccess: async (data: IFindQuestionListByExamIdOutput) => {
        if (data.ok) {
          setQuestionList(data.questionList);
        }
      },
    }
  );

  const createExamMutation = useMutation(apiCreateExam, {
    onSuccess: async (data: ICreateExamOutput) => {
      if (data.ok) {
        setisExam(true);
        findQuestionListByExamIdMutation.mutate(data.examId);
      }
    },
  });

  const createExamOnSubmit = () => {
    const createExamVlaues = createExamGetValues();
    createExamMutation.mutate(createExamVlaues);
  };

  const tiptapEditor = (editor: any) => {
    if (editor) {
      setTiptapValue(editor.getHTML());
    }
  };

  return (
    <div>
      <Head>
        <title className=" text-gray-800">시험 만들기 {WEB_TITLE}</title>
      </Head>
      <div className="p-10  m-5">
        <div className="flex flex-col items-center">
          <h1 className="mb-2 font-medium text-2xl ">시험 만들기</h1>
          <form onSubmit={createExamHandleSubmit(createExamOnSubmit)}>
            <label className="text-lg font-medium">제목</label>
            <div className=" text-xs  text-gray-500">
              시험의 제목을 입력하세요. 예) 자동차 2종보통
            </div>
            <input
              className={classNames(`form-input`, {
                "border-red-500 focus:border-red-500 focus:outline-red-500":
                  createExamErrors.name,
                "pointer-events-none": isExam,
              })}
              {...createExamRegister("name", createExamRegisterOption.name)}
              placeholder="제목"
            />
            <label className="text-lg font-medium">설명</label>
            <div className=" text-xs  text-gray-500">
              시험에 관련된 설명을 자유롭게 쓰세요
            </div>
            <input
              className={classNames(`form-input`, {
                "border-red-500 focus:border-red-500 focus:outline-red-500":
                  createExamErrors.title,
                "pointer-events-none": isExam,
              })}
              {...createExamRegister("title", createExamRegisterOption.title)}
              placeholder="설명"
            />
            {Object.values(createExamErrors).length > 0 &&
              Object.values(createExamErrors).map((error, key) => {
                return (
                  <div key={`form_error_${key}`}>
                    <FormError errorMessage={`${error.message}`} />
                    <br />
                  </div>
                );
              })}
            <div
              className={classNames(`mt-2`, { "pointer-events-none": isExam })}
            >
              <FormButton
                canClick={createExamIsValid}
                loading={false}
                actionText={isExam ? "완료" : "전송"}
              />
            </div>
          </form>
          {isExam && (
            <>
              <form>
                <div>
                  <label className="text-lg font-medium">
                    문제 - {questionList.length + 1}번
                  </label>
                  <Tiptap editor={tiptapEditor} />
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
