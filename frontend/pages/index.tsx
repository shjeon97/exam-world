import Head from "next/head";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { apiSearchExam } from "../api/axios";
import { IPaginationOutput } from "../common/type";
import { ExamCard } from "../components/ExamCard";
import { Page, PageSize, WEB_TITLE } from "../constant";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

export default function Home() {
  const [page, setPage] = useState<number>(Page);
  const [pageSize] = useState<number>(PageSize);
  const [exams, setExams] = useState<any>(null);

  const searchExamMutation = useMutation(apiSearchExam, {
    onSuccess: async (data: IPaginationOutput) => {
      if (data && data.ok) {
        if (exams) {
          setExams([...exams, ...data.result]);
        } else {
          setExams(data.result);
        }
      }
    },
  });

  useEffect(() => {
    searchExamMutation.mutate({ page, pageSize });
  }, [page]);

  const infiniteScroll = useInfiniteScroll(!searchExamMutation.isLoading);

  useEffect(() => {
    if (infiniteScroll) {
      setPage(page + 1);
    }
  }, [infiniteScroll]);

  return (
    <div className=" min-h-screen">
      <Head>
        <title className=" text-gray-800">{WEB_TITLE}</title>
      </Head>
      <div className="flex flex-wrap m-4 gap-2 ">
        {exams &&
          exams.map((exam, key) => {
            return (
              <div key={`exam_index_${key}`}>
                <ExamCard
                  userId={exam.userId}
                  name={exam.name}
                  title={exam.title}
                  id={exam.id}
                />
              </div>
            );
          })}
      </div>
      <div className="button" onClick={() => setPage(page + 1)}>
        더보기
      </div>
    </div>
  );
}
