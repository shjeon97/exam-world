import Head from "next/head";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { apiSearchExam } from "../api/axios";
import { IPaginationOutput } from "../common/type";
import { ExamCard } from "../components/ExamCard";
import { Page, PageSize, WEB_TITLE } from "../constant";

export default function Home() {
  const [page, setPage] = useState<number>(Page);
  const [pageSize] = useState<number>(PageSize);
  const [examList, setExamList] = useState<any>(null);

  const searchExamMutation = useMutation(apiSearchExam, {
    onSuccess: async (data: IPaginationOutput) => {
      if (data && data.ok) {
        if (examList) {
          examList.push(...data.result);
        } else {
          setExamList(data.result);
        }
      }
    },
  });

  useEffect(() => {
    searchExamMutation.mutate({ page, pageSize });
  }, [page]);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (
      scrollTop + clientHeight >= scrollHeight &&
      !searchExamMutation.isLoading
    ) {
      // 페이지 끝에 도달하면 추가 데이터를 받아온다
      setPage(page + 1);
    }
  };

  useEffect(() => {
    // scroll event listener 등록
    window.addEventListener("scroll", handleScroll);
    return () => {
      // scroll event listener 해제
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <div>
      <Head>
        <title className=" text-gray-800">{WEB_TITLE}</title>
      </Head>
      <div className="flex flex-wrap m-4 gap-2 ">
        {examList &&
          examList.map((exam, key) => {
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
    </div>
  );
}
