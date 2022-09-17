import Head from "next/head";
import { WEB_TITLE } from "../constant";

export default function Home() {
  return (
    <div>
      <Head>
        <title className=" text-gray-800">{WEB_TITLE}</title>
      </Head>
      <div>시험목록 페이지 개발예정</div>
    </div>
  );
}
