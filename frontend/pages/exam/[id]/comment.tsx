import { WEB_TITLE } from "../../../constant";
import Head from "next/head";

export default function ExamComment({ id }) {
  return (
    <>
      <Head>
        <title>댓글 {WEB_TITLE}</title>
      </Head>
      <div>{id} 관련 댓글 </div>
    </>
  );
}
