import classNames from "classnames";
import { data } from "cypress/types/jquery";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { apiEditExam, apiFindExamById } from "../../../api/axios";
import { ICoreOutput, IEditExamInput } from "../../../common/type";
import { FormButton } from "../../../components/form-button";
import { FormError } from "../../../components/form-error";
import { WEB_TITLE } from "../../../constant";
import { Toast } from "../../../lib/sweetalert2/toast";
import React, { useState } from "react";
import Tiptap from "../../../components/tiptap";

export default function ExamInfo() {
  const [tiptapValue, setTiptapValue] = useState("");
  const [mulitpleChoiceNumber, setmulitpleChoiceNumber] = useState<number[]>(
    []
  );

  const router = useRouter();
  const { id } = router.query;

  const {
    register: editExamRegister,
    getValues: editExamGetValues,
    formState: { errors: editExamErrors, isValid: editExamIsValid },
    handleSubmit: editExamHandleSubmit,
  } = useForm<IEditExamInput>({ mode: "onChange" });

  const editExamRegisterOption = {
    name: { required: "사용할 제목 입력해 주세요." },
    title: { required: "사용할 설명 입력해 주세요." },
  };

  const editExamMutation = useMutation(apiEditExam, {
    onSuccess: async (data: ICoreOutput) => {
      if (data.ok) {
        Toast.fire({
          icon: "success",
          title: "수정 완료",
          position: "top-end",
          timer: 1200,
        });
      }
    },
  });
  const { isLoading: findExamByIdIsLoading, data: findExamByIdData } =
    useQuery<any>([`find-exam-by-id-${id}`], () => apiFindExamById(+id), {
      enabled: !!id,
    });

  const tiptapEditor = (editor: any) => {
    if (editor) {
      setTiptapValue(editor.getHTML());
    }
  };
  const editExamOnSubmit = () => {
    const editExamVlaues = editExamGetValues();
    editExamMutation.mutate({ id, ...editExamVlaues });
  };

  const {
    register: createQuestionAndMulitpleChoiceRegister,
    getValues: createQuestionAndMulitpleChoiceGetValues,
    formState: {
      errors: createQuestionAndMulitpleChoiceErrors,
      isValid: createQuestionAndMulitpleChoiceIsValid,
    },
    setValue: createQuestionAndMulitpleChoiceSetValue,
    handleSubmit: createQuestionAndMulitpleChoiceHandleSubmit,
  } = useForm<any>({ mode: "onChange" });

  const onAddOptionClick = () => {
    setmulitpleChoiceNumber((e) => [Date.now(), ...e]);
  };

  const createQuestionAndMulitPleChoiceOnSubmit = () => {
    const { ...rest } = createQuestionAndMulitpleChoiceGetValues();
    const mulitpleChoice = mulitpleChoiceNumber.map((theId) => ({
      mulitpleChoice: rest[`mulitpleChoice-${theId}`],
      isCorrectAnswer: rest[`score-${theId}`],
    }));

    console.log(mulitpleChoice);

    let isMulitpleChoiceNull = false;

    mulitpleChoice.map((e) => {
      if (e.mulitpleChoice.trim() == "") {
        isMulitpleChoiceNull = true;
      }
    });

    if (isMulitpleChoiceNull) {
      return Toast.fire({
        icon: "error",
        text: "보기를 입력하세요.",
        position: "bottom-end",
      });
    }
  };

  const onDeleteClick = (idToDelete: number) => {
    setmulitpleChoiceNumber((e) => e.filter((id) => id !== idToDelete));
    createQuestionAndMulitpleChoiceSetValue(`mulitpleChoice-${idToDelete}`, "");
    createQuestionAndMulitpleChoiceSetValue(`score-${idToDelete}`, "");
  };

  return (
    <>
      <Head>
        <title className=" text-gray-800">시험 정보 {WEB_TITLE}</title>
      </Head>
      {!findExamByIdIsLoading && findExamByIdData && (
        <>
          <div className="p-10  m-5">
            <div className="flex flex-col items-center">
              <h1 className="mb-2 font-medium text-2xl ">시험 정보</h1>
              <form onSubmit={editExamHandleSubmit(editExamOnSubmit)}>
                <label className="text-lg font-medium">제목</label>
                <div className=" text-xs  text-gray-500">
                  시험의 제목을 입력하세요. 예) 자동차 2종보통
                </div>
                <input
                  className={classNames(`form-input`, {
                    "border-red-500 focus:border-red-500 focus:outline-red-500":
                      editExamErrors.name,
                  })}
                  {...editExamRegister("name", editExamRegisterOption.name)}
                  placeholder="제목"
                  defaultValue={findExamByIdData.exam.name}
                />
                <label className="text-lg font-medium">설명</label>
                <div className=" text-xs  text-gray-500">
                  시험에 관련된 설명을 자유롭게 쓰세요
                </div>
                <input
                  className={classNames(`form-input`, {
                    "border-red-500 focus:border-red-500 focus:outline-red-500":
                      editExamErrors.title,
                  })}
                  {...editExamRegister("title", editExamRegisterOption.title)}
                  placeholder="설명"
                  defaultValue={findExamByIdData.exam.title}
                />

                {Object.values(editExamErrors).length > 0 &&
                  Object.values(editExamErrors).map((error, key) => {
                    return (
                      <div key={`form_error_${key}`}>
                        <FormError errorMessage={`${error.message}`} />
                        <br />
                      </div>
                    );
                  })}
                <div className="mt-2">
                  <FormButton
                    canClick={editExamIsValid}
                    loading={false}
                    actionText={"수정"}
                  />
                </div>
              </form>
              <form
                onSubmit={createQuestionAndMulitpleChoiceHandleSubmit(
                  createQuestionAndMulitPleChoiceOnSubmit
                )}
              >
                <div className="  items-start">
                  <div>
                    <label className="text-lg font-medium">문제 - {}번</label>
                    <Tiptap editor={tiptapEditor} />
                  </div>
                  <div>
                    <label className="text-lg font-medium">보기</label>

                    <div
                      onClick={() => onAddOptionClick()}
                      className="button w-32"
                    >
                      보기 추가
                    </div>
                    {mulitpleChoiceNumber.length > 0 && (
                      <>
                        {mulitpleChoiceNumber.map((id, index) => {
                          return (
                            <div
                              className="flex items-center"
                              key={`mulitpleChoice-${id}`}
                            >
                              <div className="flex items-center justify-center mb-2 px-2">
                                <div className="block items-center justify-center">
                                  <label className="inline-flex  text-sm">
                                    보기 {index + 1}번
                                  </label>
                                  <input
                                    className="form-input "
                                    {...createQuestionAndMulitpleChoiceRegister(
                                      `mulitpleChoice-${id}`
                                    )}
                                  />
                                  <div className="mt-2">
                                    <label className="inline-flex  text-sm">
                                      점수
                                    </label>
                                    <input
                                      {...createQuestionAndMulitpleChoiceRegister(
                                        `score-${id}`
                                      )}
                                      type="number"
                                      className="form-input  "
                                    />
                                  </div>
                                </div>
                              </div>
                              <span
                                onClick={() => onDeleteClick(id)}
                                className="text-xl hover:cursor-pointer hover:bg-red-400"
                              >
                                🗑️
                              </span>
                            </div>
                          );
                        })}

                        <button className="button">저장</button>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
