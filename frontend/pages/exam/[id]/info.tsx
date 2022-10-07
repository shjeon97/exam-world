import classNames from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  apiCreateMultipleChoice,
  apiCreateQuestion,
  apiEditExam,
  apiFindExamById,
  apiFindMultipleChoiceListByExamId,
  apiFindQuestionListByExamId,
  apiGetMe,
} from "../../../api/axios";
import { ICoreOutput, IEditExamInput, IUserInput } from "../../../common/type";
import { FormButton } from "../../../components/form-button";
import { FormError } from "../../../components/form-error";
import { WEB_TITLE } from "../../../constant";
import { Toast } from "../../../lib/sweetalert2/toast";
import React, { useState, useEffect } from "react";
import Tiptap from "../../../components/tiptap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const { id } = query;
  return {
    props: {
      id,
    },
  };
};

export default function ExamInfo({ id }) {
  const [tiptap, setTiptap] = useState<any>(null);
  const [multipleChoiceNumber, setMultipleChoiceNumber] = useState<string[]>(
    []
  );
  const [findMultipleChoiceListByPage, setFindMultipleChoiceListByPage] =
    useState([]);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const router = useRouter();
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

  const {
    register: editExamRegister,
    getValues: editExamGetValues,
    formState: { errors: editExamErrors, isValid: editExamIsValid },
    handleSubmit: editExamHandleSubmit,
  } = useForm<IEditExamInput>({ mode: "onChange" });

  const editExamRegisterOption = {
    name: { required: "사용할 제목 입력해 주세요.", maxLength: 30 },
    title: { maxLength: 30 },
  };

  const createQuestionAndMulitpleChoiceRegisterOption = {
    score: { required: "사용할 점수 입력해 주세요." },
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

  const createQuestionMutation = useMutation(apiCreateQuestion);
  const createMultipleChoiceMutation = useMutation(apiCreateMultipleChoice);

  const { isLoading: findExamByIdIsLoading, data: findExamByIdData } =
    useQuery<any>([`exam-by-id`, id], () => apiFindExamById(+id));

  const {
    isLoading: findQuestionListByIdIsLoading,
    data: findQuestionListByExamIdData,
  } = useQuery<any>([`question-list-by-exam-id`, id], () =>
    apiFindQuestionListByExamId(+id)
  );

  const {
    isLoading: findMultipleChoiceListByExamIdIsLoading,
    data: findMultipleChoiceListByExamIdData,
  } = useQuery<any>([`multiple-choice-list-by-exam-id`, id], () =>
    apiFindMultipleChoiceListByExamId(+id)
  );

  const tiptapEditor = (editor: any) => {
    if (editor) {
      setTiptap(editor);
    }
  };

  const editExamOnSubmit = () => {
    const editExamValues = editExamGetValues();
    editExamMutation.mutate({ id, ...editExamValues });
  };

  const {
    register: createQuestionAndMultipleChoiceRegister,
    getValues: createQuestionAndMultipleChoiceGetValues,
    setValue: createQuestionAndMultipleChoiceSetValue,
    handleSubmit: createQuestionAndMultipleChoiceHandleSubmit,
    formState: {
      errors: createQuestionAndMultipleChoiceErrors,
      isValid: createQuestionAndMultipleChoiceIsValid,
    },
  } = useForm<any>({ mode: "onChange" });

  const onAddOptionClick = () => {
    setMultipleChoiceNumber((e) => [uuidv4(), ...e]);
  };

  useEffect(() => {
    try {
      setPage(findQuestionListByExamIdData?.questionList.length + 1);
    } catch (error) {
      console.log(error);
    }
  }, [
    findQuestionListByExamIdData && findQuestionListByExamIdData.questionList,
  ]);

  const createQuestionAndMultipleChoiceOnSubmit = async () => {
    const questionValue = tiptap.getHTML();
    if (questionValue.length < 8) {
      return Toast.fire({
        icon: "error",
        text: "문제를 입력하세요.",
        position: "bottom-end",
      });
    }

    const { score, ...rest } = createQuestionAndMultipleChoiceGetValues();
    const multipleChoice = multipleChoiceNumber.map((theId) => ({
      multipleChoice: rest[`multipleChoice-${theId}`],
      isCorrectAnswer: rest[`is-correct-answer-${theId}`],
    }));

    let isMulitpleChoiceNull = false;

    multipleChoice.map((e) => {
      if (e.multipleChoice.trim() == "") {
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

    await createQuestionMutation.mutateAsync({
      text: questionValue,
      page: page,
      examId: +id,
      score: +score,
    });

    multipleChoice.map(async (e, index) => {
      await createMultipleChoiceMutation.mutateAsync({
        examId: +id,
        text: e.multipleChoice,
        isCorrectAnswer: e.isCorrectAnswer,
        no: index + 1,
        page: page,
      });
    });

    queryClient.invalidateQueries([`question-list-by-exam-id`, id]);
    queryClient.invalidateQueries([`multiple-choice-list-by-exam-id`, id]);
    await Toast.fire({
      icon: "success",
      text: "저장완료.",
      position: "top-end",
      timer: 1200,
    });
    onCreateQuestionAndMultipleChoiceClick();
  };

  const handleChangePage = (page: number) => {
    setPage(page);

    const findQuestionByPage = findQuestionListByExamIdData.questionList.filter(
      (question) => question.page === page
    )[0];

    if (findQuestionByPage) {
      tiptap?.commands?.setContent(findQuestionByPage.text);
    }

    setMultipleChoiceNumber([]);

    setFindMultipleChoiceListByPage(
      findMultipleChoiceListByExamIdData.multipleChoiceList.filter(
        (e) => e.page === page
      )
    );

    findMultipleChoiceListByExamIdData.multipleChoiceList
      .filter((e) => e.page === page)
      .map(() => {
        onAddOptionClick();
      });

    createQuestionAndMultipleChoiceSetValue("score", findQuestionByPage.score);
  };

  const onDeleteClick = (idToDelete: string) => {
    setMultipleChoiceNumber((e) => e.filter((id) => id !== idToDelete));
    createQuestionAndMultipleChoiceSetValue(`multipleChoice-${idToDelete}`, "");
    createQuestionAndMultipleChoiceSetValue(
      `is-correct-answer-${idToDelete}`,
      ""
    );
  };

  const onCreateQuestionAndMultipleChoiceClick = () => {
    setPage(findQuestionListByExamIdData?.questionList.length + 1);
    tiptap?.commands?.setContent(``);
    createQuestionAndMultipleChoiceSetValue("score", 1);
    setFindMultipleChoiceListByPage([]);
    setMultipleChoiceNumber([]);
  };

  return (
    <>
      <Head>
        <title className=" text-gray-800">시험 정보 {WEB_TITLE}</title>
      </Head>
      {!findExamByIdIsLoading &&
        findExamByIdData &&
        !findMultipleChoiceListByExamIdIsLoading &&
        !findQuestionListByIdIsLoading && (
          <>
            <div className="p-10  m-5 flex flex-col items-center justify-center ">
              <div className="  max-w-4xl">
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
                    시험에 관련된 설명을 자유롭게 쓰세요. (30자 이내)
                  </div>
                  <input
                    className={classNames(`form-input `, {
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
                        <div key={`form-error-edit-exam-${key}`}>
                          <FormError errorMessage={`${error.message}`} />
                          <br />
                        </div>
                      );
                    })}
                  <div className="mt-2">
                    <FormButton
                      canClick={editExamIsValid}
                      loading={false}
                      actionText={"시험제목 및 설명수정"}
                    />
                  </div>
                </form>
                <div className="mt-4">
                  {findQuestionListByExamIdData &&
                    findQuestionListByExamIdData.questionList.length > 0 && (
                      <div className="flex flex-wrap">
                        {findQuestionListByExamIdData.questionList.map(
                          (question, index) => {
                            return (
                              <div
                                onClick={() => handleChangePage(question.page)}
                                className={classNames(`button`, {
                                  "bg-gray-900 text-white":
                                    question.page === page,
                                })}
                                key={`exam-${id}-info-${index}`}
                              >
                                {question.page}
                              </div>
                            );
                          }
                        )}
                        <div
                          onClick={() =>
                            onCreateQuestionAndMultipleChoiceClick()
                          }
                          className="button "
                        >
                          ➕
                        </div>
                      </div>
                    )}
                  <label className="text-lg font-medium ">
                    문제 - {page}번
                  </label>
                  <Tiptap editor={tiptapEditor} />
                </div>
                <form
                  onSubmit={createQuestionAndMultipleChoiceHandleSubmit(
                    createQuestionAndMultipleChoiceOnSubmit
                  )}
                >
                  <label className="text-lg font-medium">점수</label>
                  <div className=" text-xs  text-gray-500">
                    해당 문제 맞출시 줄 점수를 입력하세요.
                  </div>
                  <input
                    {...createQuestionAndMultipleChoiceRegister(
                      "score",
                      createQuestionAndMulitpleChoiceRegisterOption.score
                    )}
                    className={classNames(`form-input `, {
                      "border-red-500 focus:border-red-500 focus:outline-red-500":
                        createQuestionAndMultipleChoiceErrors.score,
                    })}
                    type="number"
                    defaultValue={1}
                  />
                  {Object.values(createQuestionAndMultipleChoiceErrors).length >
                    0 &&
                    Object.values(createQuestionAndMultipleChoiceErrors).map(
                      (error, key) => {
                        return (
                          <div
                            key={`form-error-create-question-and-multiple-choice-${key}`}
                          >
                            <FormError errorMessage={`${error.message}`} />
                            <br />
                          </div>
                        );
                      }
                    )}
                  <div className="  items-start  ">
                    <div>
                      <div className="mt-4"></div>
                      <div
                        onClick={() => onAddOptionClick()}
                        className="button w-28"
                      >
                        보기 추가
                      </div>
                      {multipleChoiceNumber.length > 0 && (
                        <>
                          <div className="flex flex-col-reverse">
                            {multipleChoiceNumber.map((id, index) => {
                              return (
                                <>
                                  <div
                                    className=" grid grid-cols-12 gap-3 items-center "
                                    key={`multipleChoice-${id}`}
                                  >
                                    <div className="col-span-9 ">
                                      <label className="text-sm">보기</label>
                                      <div className=" text-xs  text-gray-500">
                                        보기에 입력할 문장을 자유롭게 쓰세요,
                                        다중정답 가능합니다.
                                      </div>
                                      <input
                                        className="form-input "
                                        {...createQuestionAndMultipleChoiceRegister(
                                          `multipleChoice-${id}`
                                        )}
                                        defaultValue={
                                          findMultipleChoiceListByPage[index]
                                            ?.text
                                        }
                                      />
                                    </div>
                                    <div className="col-span-2">
                                      <label className="text-sm ">정답</label>
                                      <p className="truncate text-xs  text-gray-500 mb-3">
                                        정답일시 체크
                                      </p>
                                      <input
                                        {...createQuestionAndMultipleChoiceRegister(
                                          `is-correct-answer-${id}`
                                        )}
                                        type="checkbox"
                                        className="w-6 h-6 "
                                        defaultChecked={
                                          findMultipleChoiceListByPage[index]
                                            ?.isCorrectAnswer
                                        }
                                      />
                                    </div>
                                    <div
                                      onClick={() => onDeleteClick(id)}
                                      className="col-span-1 text-3xl  mt-4  hover:cursor-pointer hover:text-red-500"
                                    >
                                      <FontAwesomeIcon icon={faXmark} />
                                    </div>
                                  </div>
                                </>
                              );
                            })}
                          </div>
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
