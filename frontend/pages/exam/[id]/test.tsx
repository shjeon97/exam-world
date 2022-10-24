import classNames from "classnames";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Swal from "sweetalert2";
import {
  apiFindExamById,
  apiFindMultipleChoiceListByExamId,
  apiFindQuestionListByExamId,
  apiGetMe,
} from "../../../api/axios";
import { IUserInput } from "../../../common/type";
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
  const [multipleChoiceIsCheckedList, setMultipleChoiceIsCheckedList] =
    useState<multipleChoiceIsCheckProps[]>([]);
  const [time, setTime] = useState<number>(0);

  const { isLoading: meIsLoading, data: meData } = useQuery<IUserInput>(
    "me",
    apiGetMe
  );
  const { isLoading: findExamByIdIsLoading, data: findExamByIdData } =
    useQuery<any>([`exam-by-id`, id], () => apiFindExamById(+id));

  const {
    isLoading: findQuestionListByIdIsLoading,
    data: findQuestionListByExamIdData,
  } = useQuery<any>([`question-list-by-exam-id`, id], () =>
    apiFindQuestionListByExamId(+id)
  );

  useEffect(() => {
    if (findExamByIdData?.exam?.time > 0) {
      setTime(findExamByIdData.exam.time);
    }
  }, [findExamByIdData?.exam?.time]);

  const {
    isLoading: findMultipleChoiceListByExamIdIsLoading,
    data: findMultipleChoiceListByExamIdData,
  } = useQuery<any>([`multiple-choice-list-by-exam-id`, id], () =>
    apiFindMultipleChoiceListByExamId(+id)
  );

  const onClickMultipleChoice = (page, no) => {
    if (
      multipleChoiceIsCheckedList.find(
        (e) => e.privateKey === `page-${page}-no-${no}`
      )
    ) {
      setMultipleChoiceIsCheckedList((e) => [
        ...e.filter((e) => e.privateKey !== `page-${page}-no-${no}`),
      ]);
    } else {
      setMultipleChoiceIsCheckedList((e) => [
        ...e,
        { page, no, isChecked: true, privateKey: `page-${page}-no-${no}` },
      ]);
    }
  };

  const scoring = () => {
    setTime(0);
    let score = 0;
    findQuestionListByExamIdData.questionList.map((question) => {
      const findMultipleChoiceListByPage =
        findMultipleChoiceListByExamIdData.multipleChoiceList.filter(
          (e) => e.isCorrectAnswer === true && e.page === question.page
        );

      if (
        findMultipleChoiceListByPage.length ===
        multipleChoiceIsCheckedList.filter((e) => e.page === question.page)
          .length
      ) {
        let isCorrectAnswer = true;

        findMultipleChoiceListByPage.map((multipleChoice) => {
          multipleChoiceIsCheckedList.find((e) => e.no === multipleChoice.no);
          if (
            !multipleChoiceIsCheckedList.find((e) => e.no === multipleChoice.no)
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

  return (
    <>
      <Head>
        <title className=" text-gray-800">시험 {WEB_TITLE}</title>
      </Head>
      {!findExamByIdIsLoading &&
        findExamByIdData.ok &&
        !findQuestionListByIdIsLoading &&
        findQuestionListByExamIdData.ok &&
        !findMultipleChoiceListByExamIdIsLoading &&
        findMultipleChoiceListByExamIdData.ok && (
          <>
            {time > 0 && (
              <>
                <div className=" fixed right-5 m-2 p-3 button text-lg bg-white">
                  남은시간 {time}초
                </div>
                <br />
              </>
            )}
            <div className="flex flex-wrap  mx-5  my-10">
              {findQuestionListByExamIdData.questionList.map(
                (question, index) => {
                  return (
                    <div
                      key={index}
                      className=" w-auto h-min m-3 max-w-3xl  border-2 border-gray-600 p-5 rounded"
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
                          className="ProseMirror prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none"
                        >
                          <div
                            dangerouslySetInnerHTML={{ __html: question.text }}
                          />
                        </div>
                      </div>
                      <br />
                      {findMultipleChoiceListByExamIdData.multipleChoiceList
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
                                    multipleChoiceIsCheckedList.find(
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
                }
              )}
            </div>
            <div onClick={() => endTest()} className="button">
              시험종료
            </div>
          </>
        )}
    </>
  );
};
export default Test;
