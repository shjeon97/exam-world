import {
  faCheck,
  faCircleDot,
  faGenderless,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Swal from "sweetalert2";
import {
  apiFindExamById,
  apiFindMultipleChoicesByExamId,
  apiFindQuestionsByExamId,
  apiGetMe,
} from "../../../api/axios";
import { IFindQuestionsByExamIdOutput, IUserInput } from "../../../common/type";
import { PageLoading } from "../../../components/PageLoading";
import { WEB_TITLE } from "../../../constant";
import { useInterval } from "../../../hooks/useInterval";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const { id } = query;
  return {
    props: {
      id,
    },
  };
};

interface multipleChoiceIsCheckProps {
  privateKey: string;
  page: number;
  no: number;
  isChecked: boolean;
}

const Test = ({ id }) => {
  const [multipleChoiceIsCheckedArray, setMultipleChoiceIsCheckedArray] =
    useState<multipleChoiceIsCheckProps[]>([]);
  const [time, setTime] = useState<number>(0);

  const { isLoading: meIsLoading, data: meData } = useQuery<IUserInput>(
    "me",
    apiGetMe
  );
  const { isLoading: findExamByIdIsLoading, data: findExamByIdData } =
    useQuery<any>([`exam`, { id }], () => apiFindExamById(+id));

  const {
    isLoading: findQuestionsByIdIsLoading,
    data: findQuestionsByExamIdData,
  } = useQuery<IFindQuestionsByExamIdOutput>(
    [`questions`, { examId: id }],
    () => apiFindQuestionsByExamId(+id)
  );
  // 새로고침 막기 변수
  const preventClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
  };

  // 브라우저에 렌더링 시 한 번만 실행하는 코드
  useEffect(() => {
    (() => {
      window.addEventListener("beforeunload", preventClose);
    })();

    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);

  useEffect(() => {
    if (findExamByIdData?.exam?.time > 0) {
      setTime(findExamByIdData.exam.time);
    }
  }, [findExamByIdData?.exam?.time]);

  const {
    isLoading: findMultipleChoicesByExamIdIsLoading,
    data: findMultipleChoicesByExamIdData,
  } = useQuery<any>([`multipleChoices`, { examId: id }], () =>
    apiFindMultipleChoicesByExamId(+id)
  );

  const onClickMultipleChoice = (page, no) => {
    const multipleChoice = document.getElementById(
      `checkbox-${page}-${no}`
    ) as any;
    if (
      multipleChoiceIsCheckedArray.find(
        (e) => e.privateKey === `page-${page}-no-${no}`
      )
    ) {
      setMultipleChoiceIsCheckedArray((e) => [
        ...e.filter((e) => e.privateKey !== `page-${page}-no-${no}`),
      ]);
      multipleChoice.checked = false;
    } else {
      setMultipleChoiceIsCheckedArray((e) => [
        ...e,
        { page, no, isChecked: true, privateKey: `page-${page}-no-${no}` },
      ]);
      multipleChoice.checked = true;
    }

    if (
      findMultipleChoicesByExamIdData.multipleChoices.filter(
        (e) => e.page === page && e.isCorrectAnswer === true
      ).length === 1
    ) {
      checkOnlyOne(page, no);
    }
  };

  const scoring = () => {
    setTime(0);
    let score = 0;

    findQuestionsByExamIdData.questions.map((question) => {
      const findMultipleChoiceCorrectAnswersByPage =
        findMultipleChoicesByExamIdData.multipleChoices.filter(
          (e) => e.isCorrectAnswer === true && e.page === question.page
        );

      findMultipleChoiceCorrectAnswersByPage.map((multipleChoice) => {
        document.getElementById(
          `text-${question.page}-${multipleChoice.no}`
        ).className = "ml-2 text-green-600";
      });

      multipleChoiceIsCheckedArray.map((e) => {
        const pageNo = document.getElementById(
          `question-${question.page}-no-${e.no}`
        );
        if (pageNo) {
          pageNo.style.color = "red";
        }
      });
      findMultipleChoiceCorrectAnswersByPage.map((multipleChoice) => {
        multipleChoiceIsCheckedArray
          .filter((e) => e.no === multipleChoice.no && e.page === question.page)
          .map((e) => {
            const pageNo = document.getElementById(
              `question-${question.page}-no-${e.no}`
            );
            if (pageNo) {
              pageNo.style.color = "green";
            }
          });
      });

      if (
        findMultipleChoiceCorrectAnswersByPage.length ===
        multipleChoiceIsCheckedArray.filter((e) => e.page === question.page)
          .length
      ) {
        let isCorrectAnswer = true;

        findMultipleChoiceCorrectAnswersByPage.map((multipleChoice) => {
          if (
            !multipleChoiceIsCheckedArray.find(
              (e) => e.no === multipleChoice.no && e.page === question.page
            )
          ) {
            isCorrectAnswer = false;
          }
        });

        const correctAnswer = document.getElementById(
          `question-${question.page}-isCorrectAnswer-true`
        );

        const wrongAnswer = document.getElementById(
          `question-${question.page}-isCorrectAnswer-false`
        );

        if (isCorrectAnswer) {
          score = score + question.score;
          correctAnswer.hidden = false;
          wrongAnswer.hidden = true;
        } else {
          wrongAnswer.hidden = false;
          correctAnswer.hidden = true;
        }
      } else {
        const correctAnswer = document.getElementById(
          `question-${question.page}-isCorrectAnswer-true`
        );

        const wrongAnswer = document.getElementById(
          `question-${question.page}-isCorrectAnswer-false`
        );
        wrongAnswer.hidden = false;
        correctAnswer.hidden = true;
      }
    });

    Swal.fire({
      title:
        findExamByIdData?.exam?.minimumPassScore === 0
          ? `${score}점`
          : score >= findExamByIdData?.exam?.minimumPassScore
          ? "합격"
          : "불합격",
      html:
        findExamByIdData?.exam?.minimumPassScore !== 0 && `<b>${score}점 </b>`,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "확인",
    });
  };

  const endTest = () => {
    Swal.fire({
      title: "Are you sure?",
      html: "정말 시험종료를 원하십니까?",
      icon: "warning",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "종료하기",
      showCancelButton: true,
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        scoring();
      }
    });
  };

  useInterval(() => {
    if (time > 0) {
      setTime(time - 1);
      if (time === 1) {
        Swal.fire({
          title: "시험종료",
          html: "남은시간 끝났습니다. ",
          icon: "warning",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "종료하기",
          showCancelButton: true,
          cancelButtonText: "계속 진행하기",
        }).then((result) => {
          if (result.isConfirmed) {
            scoring();
          }
        });
      }
    }
  }, 1000);

  function secondToTime(seconds: number) {
    var hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    seconds = seconds - hours * 3600 - minutes * 60;
    if (hours >= 1) {
      return (
        hours + "시간 " + addZero(minutes) + "분 " + addZero(seconds) + "초"
      );
    }
    return addZero(minutes) + "분 " + addZero(seconds) + "초";
    function addZero(num: number) {
      return (num < 10 ? "0" : "") + num;
    }
  }

  const checkOnlyOne = (page, no) => {
    const checkboxes = document.getElementsByName(
      `checkbox-${page}`
    ) as NodeListOf<any>;

    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].id !== `checkbox-${page}` + "-" + no) {
        setMultipleChoiceIsCheckedArray((e) => [
          ...e.filter(
            (e) =>
              e.privateKey !==
              `page-${page}-no-${checkboxes[i].id.split("-").slice(-1)[0]}`
          ),
        ]);
        checkboxes[i].checked = false;
      }
    }
  };

  return (
    <>
      <Head>
        <title>시험 {WEB_TITLE}</title>
      </Head>
      {!findExamByIdIsLoading &&
      findExamByIdData.ok &&
      !findQuestionsByIdIsLoading &&
      findQuestionsByExamIdData.ok &&
      !findMultipleChoicesByExamIdIsLoading &&
      findMultipleChoicesByExamIdData.ok ? (
        <>
          {time > 0 && (
            <div className="mb-8 mt-2">
              <div className="fixed inset-x-0 sm:scale-100 scale-75 dark:bg-gray-700 bg-yellow-100  mx-auto w-60 px-3 py-2 button hover:bg-yellow-100 hover:text-yellow-900 dark:hover:text-white hover:cursor-default text-lg  z-50 ">
                남은시간 {secondToTime(time)}
              </div>
              <br />
            </div>
          )}
          <div className="  hidden lg:block fixed border-2 border-yellow-900 dark:border-slate-400 rounded overflow-auto  max-h-96  right-0 w-96 m-5 mb-8  ">
            <div className="flex flex-wrap">
              {findQuestionsByExamIdData.questions.map((question, index) => {
                return (
                  <a
                    href={`#question-page-${question.page}`}
                    key={`href-${index}`}
                  >
                    <table className="w-14 h-14 m-2 text-yellow-900 hover:cursor-pointer hover:dark:bg-slate-800 hover:bg-orange-300 p-2 rounded dark:text-gray-100 dark:bg-slate-700 dark:border-slate-800  bg-orange-200 border-2 border-orange-700">
                      <th className="border-2  border-orange-700 dark:border-slate-800 ">
                        {question.page}
                      </th>
                      <tbody className="text-center h-7 border-2  border-orange-700 dark:border-slate-800">
                        <span></span>
                        {multipleChoiceIsCheckedArray
                          .filter((e) => e.page === question.page)
                          .map((e, index) => {
                            if (index === 0) {
                              return (
                                <span
                                  id={`question-${question.page}-no-${e.no}`}
                                >
                                  {e.no}
                                </span>
                              );
                            } else {
                              return (
                                <span
                                  id={`question-${question.page}-no-${e.no}`}
                                >
                                  ,{e.no}
                                </span>
                              );
                            }
                          })}
                      </tbody>
                    </table>
                  </a>
                );
              })}
            </div>
          </div>
          <div className=" grid grid-cols-12">
            <div className=" col-start-1 lg:col-start-2 xl:col-start-3 2xl:col-start-4  col-end-13 lg:col-end-12">
              {findQuestionsByExamIdData.questions.map((question, index) => {
                return (
                  <div
                    key={index}
                    className="h-auto  p-2  lg:w-3/5 lg:max-w-3xl  w-full rounded"
                  >
                    <a id={`question-page-${question.page}`} />
                    <div className="h-20"></div>
                    <div
                      id={`question-${question.page}-isCorrectAnswer-true`}
                      hidden={true}
                      className="mb-12"
                    >
                      <FontAwesomeIcon
                        className="absolute top-auto text-9xl opacity-80 text-red-700"
                        icon={faGenderless}
                      />
                    </div>
                    <div
                      id={`question-${question.page}-isCorrectAnswer-false`}
                      hidden={true}
                      className="mb-8"
                    >
                      <FontAwesomeIcon
                        className="absolute text-8xl  opacity-80 text-red-700"
                        icon={faXmark}
                      />
                    </div>
                    <div className={classNames(`text-lg`)}>
                      {question.page}번 문제{" "}
                      {question.score > 0 && `(${question.score}점)`}
                    </div>
                    <br />
                    <div className=" border border-yellow-900 dark:border-gray-300 rounded overflow-auto  ">
                      <div
                        suppressContentEditableWarning={true}
                        contentEditable="true"
                        translate="no"
                        tabIndex={0}
                        className="ProseMirror m-5 focus:outline-none hover:cursor-default"
                      >
                        <div
                          spellCheck={false}
                          dangerouslySetInnerHTML={{ __html: question.text }}
                        />
                      </div>
                    </div>
                    <br />
                    {findMultipleChoicesByExamIdData.multipleChoices
                      .filter((e) => e.page === question.page)
                      .map((multipleChoice, index) => {
                        return (
                          <span
                            key={index}
                            className={classNames(
                              `p-1 hover:cursor-pointer hover:underline hover:text-blue-500`,
                              {
                                "text-blue-700 text-base hover:text-blue-700  hover:no-underline":
                                  multipleChoiceIsCheckedArray.find(
                                    (e) =>
                                      e.privateKey ===
                                      `page-${multipleChoice.page}-no-${multipleChoice.no}`
                                  ),
                              }
                            )}
                          >
                            <div className="flex mb-4 items-center text-md">
                              <input
                                onClick={() =>
                                  onClickMultipleChoice(
                                    multipleChoice.page,
                                    multipleChoice.no
                                  )
                                }
                                name={`checkbox-${multipleChoice.page}`}
                                id={`checkbox-${multipleChoice.page}-${multipleChoice.no}`}
                                type="checkbox"
                                className={`w-6 h-6 text-blue-600  bg-gray-100  border-gray-300 focus:ring-blue-500 focus:ring-2 ${
                                  findMultipleChoicesByExamIdData.multipleChoices.filter(
                                    (e) =>
                                      e.page === question.page &&
                                      e.isCorrectAnswer === true
                                  ).length > 1
                                    ? ""
                                    : "rounded-full"
                                }`}
                              />
                              <span
                                id={`text-${multipleChoice.page}-${multipleChoice.no}`}
                                onClick={() =>
                                  onClickMultipleChoice(
                                    multipleChoice.page,
                                    multipleChoice.no
                                  )
                                }
                                className="ml-2"
                              >
                                {" "}
                                {multipleChoice.text}
                              </span>
                            </div>
                          </span>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          </div>

          <div onClick={() => endTest()} className="button">
            시험종료
          </div>
        </>
      ) : (
        <PageLoading text="Loading" />
      )}
    </>
  );
};
export default Test;
