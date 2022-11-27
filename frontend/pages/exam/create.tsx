import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { CreateExamForm } from "../../components/forms/exam/create/CreateExamForm";
import { PageLoading } from "../../components/PageLoading";
import { WEB_TITLE } from "../../constant";
import { useMe } from "../../hooks/useMe";

export default function CreateExam() {
  const { isLoading } = useMe();

  let router = useRouter();

  useEffect(() => {
    Swal.fire({
      title: "본 시험을 만들기 전에 아래와 내용을 확인해주세요.",
      html: `
      <div>
        <b>1) 크롬브라우저로 사용해주세요.</b> ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ<br>
        <b>2) 음란물 등록시 임의로 삭제되며, 관련 법률에 의하여 처벌받을 수 있습니다.</b> ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ<br>
        <b>3) 저작권이 존제하는 문제와 해설을 불법 복제 하여 올릴 시 민/형사상 처벌을 받을 수 있습니다.</b> ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ
      </div>`,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "동의합니다.",
      showCancelButton: true,
      cancelButtonText: "동의하지 않습니다.",
    }).then((result) => {
      if (result.isConfirmed) {
      } else {
        router.back();
      }
    });
  }, []);

  if (isLoading) {
    return <PageLoading text="Loading" />;
  }
  return (
    <div>
      <Head>
        <title className=" text-gray-800">시험 만들기 {WEB_TITLE}</title>
      </Head>
      <div className="p-10  m-5 h-screen">
        <div className="flex flex-col items-center">
          <h1 className="mb-2 font-medium text-2xl ">시험 만들기</h1>
          <CreateExamForm />
        </div>
      </div>
    </div>
  );
}
