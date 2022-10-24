import Head from "next/head";
import React from "react";
import { useQuery } from "react-query";
import { apiGetMe } from "../api/axios";
import { IUserInput } from "../common/type";
import { QnaForm } from "../components/forms/qna/QnaForm";
import { WEB_TITLE } from "../constant";

const Qna = () => {
  const { isLoading: meIsLoading, data: meData } = useQuery<IUserInput>(
    "me",
    apiGetMe
  );

  return (
    <>
      <Head>
        <title className=" text-gray-800">문의사항 {WEB_TITLE}</title>
      </Head>
      <div className="p-10  m-5">
        <div className="flex flex-col items-center">
          <h1 className="mb-2 font-medium text-2xl ">문의사항</h1>
          <QnaForm />
        </div>
      </div>
    </>
  );
};

export default Qna;
