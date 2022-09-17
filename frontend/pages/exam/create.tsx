import classNames from "classnames";
import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { apiCreateExam } from "../../api/axios";
import { ICoreOutput, ICreateExamInput } from "../../common/type";
import { FormButton } from "../../components/form-button";
import { FormError } from "../../components/form-error";
import { WEB_TITLE } from "../../constant";

export default function CreateExam() {
  const [isExam, setisExam] = useState<boolean>(false);
  const {
    register: createExamRegister,
    getValues: createExamGetValues,
    formState: { errors: createExamErrors, isValid: createExamIsValid },
    handleSubmit: createExamHandleSubmit,
  } = useForm<ICreateExamInput>({ mode: "onChange" });

  const createExamRegisterOption = {
    name: { required: "사용할 제목 입력해 주세요." },
    title: { required: "사용할 설명 입력해 주세요." },
  };

  const createExamMutation = useMutation(apiCreateExam, {
    onSuccess: async (data: ICoreOutput) => {
      if (data.ok) {
        setisExam(true);
        console.log(isExam);
      }
    },
  });

  const createExamOnSubmit = () => {
    const createExamVlaues = createExamGetValues();
    createExamMutation.mutate(createExamVlaues);
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
            <div className="mt-2">
              <FormButton
                canClick={createExamIsValid}
                loading={false}
                actionText={"전송"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
