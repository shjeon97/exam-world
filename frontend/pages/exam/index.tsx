import Head from "next/head";
import { useQuery } from "react-query";
import { apiFindExamListByMe, apiGetMe } from "../../api/axios";
import { IFindExamListByMe, IUserInput } from "../../common/type";
import { ExamCard } from "../../components/exam-card";
import { LinkButton } from "../../components/link-button";
import { WEB_TITLE } from "../../constant";

export default function Index() {
  const { isLoading, data } = useQuery<IFindExamListByMe>(
    "exam_list_by_me",
    apiFindExamListByMe
  );
  const { isLoading: meIsLoading, data: meData } = useQuery<IUserInput>(
    "me",
    apiGetMe
  );

  return (
    <div>
      <Head>
        <title className=" text-gray-800"> 내가 만든 시험 {WEB_TITLE}</title>
      </Head>
      <div className="flex flex-row m-4 ">
        <LinkButton name="➕" link="/exam/create" />
      </div>
      <div className="flex flex-row m-4 ">
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
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
