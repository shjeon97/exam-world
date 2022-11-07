import Head from "next/head";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { apiSearchExamsByMe, apiGetMe, apiSearchExam } from "../../api/axios";
import {
  IFindExamsByMeOutput,
  IPaginationOutput,
  IUserInput,
} from "../../common/type";
import { ExamCard } from "../../components/ExamCard";
import { LinkButton } from "../../components/buttons/LinkButton";
import { Page, PageSize, WEB_TITLE } from "../../constant";
import { Toast } from "../../lib/sweetalert2/toast";
import { GrAdd } from "react-icons/gr";
import { useEffect, useState } from "react";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

export default function Index() {
  const [page, setPage] = useState<number>(Page);
  const [pageSize] = useState<number>(PageSize);
  const [exams, setExams] = useState<any>(null);
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

  useEffect(() => {
    searchExamByMeMutation.mutate({
      page,
      pageSize,
    });
  }, [page, meData]);

  const infiniteScroll = useInfiniteScroll(!searchExamByMeMutation.isLoading);

  useEffect(() => {
    if (infiniteScroll) {
      setPage(page + 1);
    }
  }, [infiniteScroll]);

  return (
    <div>
      <Head>
        <title className=" text-gray-800"> 내가 만든 시험 {WEB_TITLE}</title>
      </Head>
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
