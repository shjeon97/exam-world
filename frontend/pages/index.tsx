import Head from "next/head";
import { useQuery } from "react-query";
import { apiAllExamList } from "../api/axios";
import { IAllExamListOutput } from "../common/type";
import { ExamCard } from "../components/ExamCard";
import { WEB_TITLE } from "../constant";

export default function Home() {
  const { isLoading, data } = useQuery<IAllExamListOutput>(
    "all_exam_list",
    apiAllExamList
  );

  return (
    <div>
      <Head>
        <title className=" text-gray-800">{WEB_TITLE}</title>
      </Head>
      <div className="flex flex-wrap m-4 gap-2 ">
        {!isLoading &&
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
