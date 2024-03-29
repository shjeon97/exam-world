import Head from "next/head";
import React from "react";
import { QnaForm } from "../components/forms/qna/QnaForm";
import { WEB_TITLE } from "../constant";

const Qna = () => {
  return (
    <>
      <Head>
        <title className=" text-gray-800 ">문의사항 {WEB_TITLE}</title>
      </Head>
      <div className="p-10  m-5 h-screen">
        <div className="flex flex-col items-center">
          <h1 className="mb-2 font-medium text-2xl ">문의사항</h1>
          <QnaForm />
        </div>
      </div>
    </>
  );
};

export default Qna;
