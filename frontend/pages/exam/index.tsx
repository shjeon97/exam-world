import Head from "next/head";
import { Layout } from "../../components/layout";
import { WEB_TITLE } from "../../constant";

export default function Index() {
  return (
    <Layout>
      <div>
        <Head>
          <title className=" text-gray-800"> 내가 만든 시험 {WEB_TITLE}</title>
        </Head>
        <div className="h-16" />
        <div>내가 만든 시험 페이지 개발예정</div>
      </div>
    </Layout>
  );
}
