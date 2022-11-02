import Head from "next/head";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { apiFindExamsByMe, apiGetMe } from "../../api/axios";
import { IFindExamsByMeOutput, IUserInput } from "../../common/type";
import { ExamCard } from "../../components/ExamCard";
import { LinkButton } from "../../components/buttons/LinkButton";
import { WEB_TITLE } from "../../constant";
import { Toast } from "../../lib/sweetalert2/toast";
import { GrAdd } from "react-icons/gr";

export default function Index() {
  const { isLoading, data } = useQuery<IFindExamsByMeOutput>(
    "exams_by_me",
    apiFindExamsByMe
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
        <LinkButton name={<GrAdd />} link="/exam/create" />
      </div>
      <div className="flex flex-wrap m-4 gap-2 ">
        {!isLoading &&
          !meIsLoading &&
          meData &&
          data.ok &&
          data.exams.length >= 1 &&
          data.exams.map((exam, key) => {
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
