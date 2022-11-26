import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import Swal from "sweetalert2";
import { apiGetMe } from "../../api/axios";
import { IUserInput } from "../../common/type";
import { CreateExamForm } from "../../components/forms/exam/create/CreateExamForm";
import { WEB_TITLE } from "../../constant";
import { Toast } from "../../lib/sweetalert2/toast";

export default function CreateExam() {
  const { isLoading: meIsLoading, data: meData } = useQuery<IUserInput>(
    "me",
    apiGetMe
  );
  let router = useRouter();
  if (!meIsLoading && !meData) {
    Toast.fire({
      icon: "error",
      title: `유저 정보를 찾지 못하였습니다. 다시 로그인 해주세요.`,
      position: "top-end",
      timer: 3000,
      showClass: {
        popup: "none",
      },
      hideClass: {
        popup: " animate__fadeOutUp",
      },
    });
    router.push("/login");
  }

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
