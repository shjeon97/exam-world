import classNames from "classnames";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { useState } from "react";
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
              multipleChoiceIsCheckedList.find(
                (e) => e.no === multipleChoice.no
              );
              if (
                !multipleChoiceIsCheckedList.find(
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
          title: `${score}점`,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "확인",
        });
      }
    });
  };

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
