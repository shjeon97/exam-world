import Head from "next/head";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { apiSearchExam } from "../api/axios";
import { IExam, IPaginationOutput } from "../common/type";
import { ExamCard } from "../components/ExamCard";
import { ExamSearchForm } from "../components/forms/exam/ExamSearchForm";
import { Page, PageSize, WEB_TITLE } from "../constant";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

export default function Home() {
  const [page, setPage] = useState<number>(Page);
  const [pageSize] = useState<number>(PageSize);
  const [sort, setSort] = useState<string>("view");
  const [exams, setExams] = useState<IExam[]>(null);
  const [type, setType] = useState<string>("");
  const [value, setValue] = useState<string>("");
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
    searchExamMutation.mutate({
      page,
      "page-size": pageSize,
      type: type ? type : null,
      value: value ? value : null,
      sort: sort ? sort : null,
    });
  }, [page]);
  console.log(type, value, sort);

  const infiniteScroll = useInfiniteScroll(!searchExamMutation.isLoading);

  useEffect(() => {
    if (infiniteScroll) {
      setPage(page + 1);
    }
  }, [infiniteScroll]);

  return (
    <div className=" min-h-screen">
      <Head>
        <title>{WEB_TITLE}</title>
      </Head>
      {!searchExamMutation.isLoading && exams && (
        <ExamSearchForm
          mutation={searchExamMutation}
          setExams={setExams}
          setType={setType}
          type={type}
          setValue={setValue}
          value={value}
          setSort={setSort}
          sort={sort}
        />
      )}
      <div className="flex flex-wrap m-4 gap-2 justify-center">
        {exams &&
          exams.map((exam, key) => {
            return (
              <div key={`exam_index_${key}`}>
                <ExamCard
                  userId={exam.userId}
                  userNickName={exam.user.nickname}
                  title={exam.title}
                  description={exam.description}
                  id={exam.id}
                  time={exam.time}
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
