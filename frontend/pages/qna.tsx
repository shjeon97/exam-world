import Head from "next/head";
import React from "react";
import { Layout } from "../components/layout";
import { WEB_TITLE } from "../constant";

const Qna = () => {
  return (
    <>
      <Head>
        <title className=" text-gray-800">문의사항 {WEB_TITLE}</title>
      </Head>
      <Layout>
        <div className="h-16" />
        <div className="p-10  m-5">
          <div className="flex flex-col items-center">
            <h1 className="mb-2 font-medium text-2xl ">문의사항</h1>
            <div>
              <form className=" max-w-sm">
                <label className="text-sm font-medium">이메일</label>
                <input
                  type={"email"}
                  // className={classnames(`form-input`, {
                  //   "border-red-500 focus:border-red-500 focus:outline-red-500":
                  //     errors.email,
                  // })}
                  // {...register("email", registerOption.email)}
                  placeholder="이메일"
                  // defaultValue={meData.email}
                />
                <label className="text-sm font-medium">닉네임</label>

                <input
                  // className={classnames(`form-input`, {
                  //   "border-red-500 focus:border-red-500 focus:outline-red-500":
                  //     errors.name,
                  // })}
                  // {...register("name", registerOption.name)}
                  placeholder="닉네임"
                  // defaultValue={meData.name}
                />

                {/* {Object.values(errors).length > 0 &&
                    Object.values(errors).map((error, key) => {
                      return (
                        <div key={`form_error_${key}`}>
                          <FormError errorMessage={error.message} />
                          <br />
                        </div>
                      );
                    })} */}
                <div className=" grid grid-cols-2 gap-4">
                  {/* <FormButton
                      canClick={isValid}
                      loading={false}
                      actionText={"정보 수정"}
                    /> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Qna;
