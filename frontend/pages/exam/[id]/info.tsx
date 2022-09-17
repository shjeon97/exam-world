import { data } from "cypress/types/jquery";
import Head from "next/head";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { apiFindExamById } from "../../../api/axios";
import { WEB_TITLE } from "../../../constant";

export default function ExamInfo() {
  const router = useRouter();
  const { id } = router.query;

  const { isLoading: findExamByIdIsLoading, data: findExamByIdData } =
    useQuery<any>([`find-exam-by-id-${id}`], () => apiFindExamById(+id), {
      enabled: !!id,
    });

  if (!findExamByIdIsLoading && findExamByIdData) {
    console.log(findExamByIdData.exam);
  }
  return (
    <>
      <Head>
        <title className=" text-gray-800">시험 정보 {WEB_TITLE}</title>
      </Head>
    </>
  );
}
