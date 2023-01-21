import Head from "next/head";
import { useMutation } from "react-query";
import { apiSearchExamsByMe } from "../../api/axios";
import { IExam, IPaginationOutput } from "../../common/type";
import { ExamCard } from "../../components/ExamCard";
import { LinkButton } from "../../components/buttons/LinkButton";
import { Page, PageSize, WEB_TITLE } from "../../constant";
import { GrAdd } from "react-icons/gr";
import { useEffect, useState } from "react";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

import { useMe } from "../../hooks/useMe";
import { PageLoading } from "../../components/PageLoading";
import { ExamSearchForm } from "../../components/forms/exam/ExamSearchForm";

export default function Index() {
  const [page, setPage] = useState<number>(Page);
  const [pageSize] = useState<number>(PageSize);
  const [exams, setExams] = useState<IExam[]>(null);
  const [type, setType] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const searchExamByMeMutation = useMutation(apiSearchExamsByMe, {
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

  const { isLoading } = useMe();

  useEffect(() => {
    searchExamByMeMutation.mutate({
      page,
      "page-size": pageSize,
      type: type ? type : null,
      value: value ? value : null,
    });
  }, [page]);

  const infiniteScroll = useInfiniteScroll(!searchExamByMeMutation.isLoading);

  useEffect(() => {
    if (infiniteScroll) {
      setPage(page + 1);
    }
  }, [infiniteScroll]);

  if (isLoading) {
    return <PageLoading text="Loading" />;
  }

  return (
    <div className="h-screen">
      <Head>
        <title className=" text-gray-800"> 내가 만든 시험 {WEB_TITLE}</title>
      </Head>
      {!searchExamByMeMutation.isLoading && (
        <ExamSearchForm
          mutation={searchExamByMeMutation}
          setExams={setExams}
          setType={setType}
          type={type}
          setValue={setValue}
          value={value}
        />
      )}
      <div className="flex flex-row m-4 ">
        <LinkButton name={<GrAdd />} link="/exam/create" />
      </div>
      <div className="flex flex-wrap m-4 gap-2 ">
        {exams &&
          exams.map((exam, key) => {
            return (
              <div key={`exam_index_${key}`}>
                <ExamCard
                  userId={exam.user.id}
                  userNickName={exam.user.nickname}
                  description={exam.description}
                  title={exam.title}
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
