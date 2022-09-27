import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
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

const Test = ({ id }) => {
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
            <div className="flex justify-end mx-5  my-10">
              <div className="button">시험종료</div>
            </div>
            <div className="flex flex-wrap  mx-5  my-10">
              {findQuestionListByExamIdData.questionList.map(
                (question, index) => {
                  return (
                    <div
                      key={index}
                      className=" w-auto h-min m-3 max-w-3xl  border-2 border-gray-600 p-5 rounded"
                    >
                      <div className=" text-lg">{question.page}번 문제</div>
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
                              key={index}
                              className="p-1 hover:cursor-pointer hover:underline   hover:text-blue-500"
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
          </>
        )}
    </>
  );
};

export default Test;
