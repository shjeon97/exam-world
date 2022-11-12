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
    useQuery<any>([`exam-by-id`, { id }], () => apiFindExamById(+id));

  const {
    isLoading: findQuestionsByIdIsLoading,
    data: findQuestionsByExamIdData,
  } = useQuery<IFindQuestionsByExamIdOutput>(
    [`questions-by-examId`, { examId: id }],
    () => apiFindQuestionsByExamId(+id)
  );

  useEffect(() => {
    if (findExamByIdData?.exam?.time > 0) {
      setTime(findExamByIdData.exam.time);
    }
  }, [findExamByIdData?.exam?.time]);

  const {
    isLoading: findMultipleChoicesByExamIdIsLoading,
    data: findMultipleChoicesByExamIdData,
  } = useQuery<any>([`multipleChoices-by-examId`, { examId: id }], () =>
    apiFindMultipleChoicesByExamId(+id)
  );

  const onClickMultipleChoice = (page, no) => {
    if (
      multipleChoiceIsCheckedArray.find(
        (e) => e.privateKey === `page-${page}-no-${no}`
      )
    ) {
      setMultipleChoiceIsCheckedArray((e) => [
        ...e.filter((e) => e.privateKey !== `page-${page}-no-${no}`),
      ]);
    } else {
      setMultipleChoiceIsCheckedArray((e) => [
        ...e,
        { page, no, isChecked: true, privateKey: `page-${page}-no-${no}` },
      ]);
    }
  };

  const scoring = () => {
    setTime(0);
    let score = 0;
    findQuestionsByExamIdData.questions.map((question) => {
      const findMultipleChoicesByPage =
        findMultipleChoicesByExamIdData.multipleChoices.filter(
          (e) => e.isCorrectAnswer === true && e.page === question.page
        );

      if (
        findMultipleChoicesByPage.length ===
        multipleChoiceIsCheckedArray.filter((e) => e.page === question.page)
          .length
      ) {
        let isCorrectAnswer = true;

        findMultipleChoicesByPage.map((multipleChoice) => {
          multipleChoiceIsCheckedArray.find((e) => e.no === multipleChoice.no);
          if (
            !multipleChoiceIsCheckedArray.find(
              (e) => e.no === multipleChoice.no
            )
          ) {
            isCorrectAnswer = false;
          }
        });
        if (isCorrectAnswer) {
          score = score + question.score;
        }
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

  return (
    <>
      <Head>
        <title className=" text-gray-800">시험 {WEB_TITLE}</title>
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
              <div className="fixed inset-x-0  mx-auto w-60 px-3 py-2 button text-lg bg-white z-50">
                남은시간 {secondToTime(time)}
              </div>
              <br />
            </div>
          )}
          <div className="flex flex-wrap justify-center ">
            {findQuestionsByExamIdData.questions.map((question, index) => {
              return (
                <div
                  key={index}
                  // className=" w-auto h-min m-3 md:max-w-3xl max-w-md  border-2 border-gray-600 p-5 rounded"
                  className=" lg:w-2/5 md:w-1/2 w-auto  h-auto m-3 md:max-w-3xl max-w-md  border-2 border-gray-600 p-5 rounded"
                >
                  <div className=" text-lg">
                    {question.page}번 문제 ({question.score}점)
                  </div>
                  <br />
                  <div className=" border border-gray-400 rounded overflow-auto  ">
                    <div
                      contentEditable="true"
                      translate="no"
                      tabIndex={0}
                      className="ProseMirror m-5 focus:outline-none pointer-events-none"
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: question.text }}
                      />
                    </div>
                  </div>
                  <br />
                  {findMultipleChoicesByExamIdData.multipleChoices
                    .filter((e) => e.page === question.page)
                    .map((multipleChoice, index) => {
                      return (
                        <div
                          onClick={() =>
                            onClickMultipleChoice(
                              multipleChoice.page,
                              multipleChoice.no
                            )
                          }
                          key={index}
                          className={classNames(
                            `p-1 hover:cursor-pointer hover:underline   hover:text-blue-500`,
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
                          {index + 1}번 {multipleChoice.text}
                        </div>
                      );
                    })}
                </div>
              );
            })}
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
