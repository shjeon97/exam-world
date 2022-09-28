import classNames from "classnames";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { useQuery } from "react-query";
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

                      <div
                        className=" border border-gray-400 p-5  font-bold rounded"
                        dangerouslySetInnerHTML={{ __html: question.text }}
                      />
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
                                  "text-blue-700":
                                    multipleChoiceIsCheckedList.find(
                                      (e) =>
                                        e.privateKey ===
                                        `page-${multipleChoice.page}-no-${multipleChoice.no}`
                                    ),
                                }
                              )}
                              // className="p-1 hover:cursor-pointer hover:underline   hover:text-blue-500"
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
            <div className="button">시험종료</div>
          </>
        )}
    </>
  );
};

export default Test;
