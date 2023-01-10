import Head from "next/head";
import { useMutation } from "react-query";
import { apiSearchExamsByMe } from "../../api/axios";
import { IExam, IFormSearchInput, IPaginationOutput } from "../../common/type";
import { ExamCard } from "../../components/ExamCard";
import { LinkButton } from "../../components/buttons/LinkButton";
import { Page, PageSize, WEB_TITLE } from "../../constant";
import { GrAdd } from "react-icons/gr";
import { useEffect, useState } from "react";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import { useMe } from "../../hooks/useMe";
import { PageLoading } from "../../components/PageLoading";

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

  const { register, handleSubmit, getValues } = useForm<IFormSearchInput>({
    mode: "onChange",
  });

  const onSearchSubmit = () => {
    if (!searchExamByMeMutation.isLoading) {
      const { type, value } = getValues();
      setType(type);
      setValue(value);

      flushSync(() => {
        setExams(null);
      });
      searchExamByMeMutation.mutate({
        page: 1,
        "page-size": pageSize,
        type,
        value,
      });
    }
  };

  if (isLoading) {
    return <PageLoading text="Loading" />;
  }

  return (
    <div className="h-screen">
      <Head>
        <title className=" text-gray-800"> 내가 만든 시험 {WEB_TITLE}</title>
      </Head>
      <div className=" items-center justify-center flex lg:text-lg text-md ">
        <form
          className=" mt-4 flex flex-wrap gap-1"
          onSubmit={handleSubmit(onSearchSubmit)}
        >
          <div className="flex">
            <div className="button focus:outline-none rounded-r-none border-r-0 mr-0 ">
              검색대상
            </div>
            <select
              {...register("type")}
              className="form-input text-sm w-32 h-11 mx-0 dark:border-gray-400 justify-center border-2 border-yellow-600 "
            >
              <option value="title">제목</option>
              <option value="description">부가설명</option>
            </select>
          </div>
          <div className="flex">
            <input
              {...register("value")}
              className=" form-input h-11 border-2 border-yellow-600 dark:border-gray-400 rounded-r-none "
              placeholder="검색값을 입력하세요."
              defaultValue={value}
            />
            <button className="button border-l-0 rounded-l-none mx-0 w-20">
              {searchExamByMeMutation.isLoading ? "로딩" : "검색"}
            </button>
          </div>

          <div
            onClick={() => {
              window.location.reload();
            }}
            className="button"
          >
            전체
          </div>
        </form>
      </div>
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
