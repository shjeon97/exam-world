import Head from "next/head";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { apiFindExamListByMe, apiGetMe } from "../../api/axios";
import { IFindExamListByMeOutput, IUserInput } from "../../common/type";
import { ExamCard } from "../../components/exam-card";
import { LinkButton } from "../../components/link-button";
import { WEB_TITLE } from "../../constant";
import { Toast } from "../../lib/sweetalert2/toast";

export default function Index() {
  const { isLoading, data } = useQuery<IFindExamListByMeOutput>(
    "exam_list_by_me",
    apiFindExamListByMe
  );
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
    });
    router.push("/login");
  }

  return (
    <div>
      <Head>
        <title className=" text-gray-800"> 내가 만든 시험 {WEB_TITLE}</title>
      </Head>
      <div className="flex flex-row m-4 ">
        <LinkButton name="➕" link="/exam/create" />
      </div>
      <div className="flex flex-wrap m-4 gap-2 ">
        {!isLoading &&
          !meIsLoading &&
          meData &&
          data.ok &&
          data.examList.length >= 1 &&
          data.examList.map((exam, key) => {
            return (
              <div key={`exam_index_${key}`}>
                <ExamCard
                  userId={exam.user.id}
                  name={exam.name}
                  title={exam.title}
                  id={exam.id}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
