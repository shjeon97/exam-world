import Head from "next/head";
import { Layout } from "../../components/layout";
import { WEB_TITLE } from "../../constant";

export default function CreateExam() {
  return (
    <Layout>
      <div>
        <Head>
          <title className=" text-gray-800">시험 만들기 {WEB_TITLE}</title>
        </Head>
        <div className="h-16" />
        <div>시험 만들기 페이지 개발예정</div>
      </div>
    </Layout>
  );
}
