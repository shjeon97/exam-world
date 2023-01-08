import classNames from "classnames";
import Head from "next/head";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { apiSearchExam } from "../api/axios";
import { IExam, IFormSearchInput, IPaginationOutput } from "../common/type";
import { ExamCard } from "../components/ExamCard";
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

  const infiniteScroll = useInfiniteScroll(!searchExamMutation.isLoading);

  useEffect(() => {
    if (infiniteScroll) {
      setPage(page + 1);
    }
  }, [infiniteScroll]);

  const { register, handleSubmit, getValues } = useForm<IFormSearchInput>({
    mode: "onChange",
  });

  const onSearchSubmit = () => {
    if (!searchExamMutation.isLoading) {
      const { type, value } = getValues();
      setType(type);
      setValue(value);
      flushSync(() => {
        setExams(null);
      });
      searchExamMutation.mutate({
        page: 1,
        "page-size": pageSize,
        type,
        value,
        sort,
      });
    }
  };

  return (
    <div className=" min-h-screen">
      <Head>
        <title>{WEB_TITLE}</title>
      </Head>
      <div className=" items-center justify-center flex lg:text-lg text-md ">
        <form
          className=" mt-4 flex flex-wrap gap-1 "
          onSubmit={handleSubmit(onSearchSubmit)}
        >
          <div className="flex">
            <button
              onClick={(e) => setSort("view")}
              className={classNames(
                "button border-r-0 mx-0 rounded-none focus:outline-none focus:ring-0",
                {
                  "bg-orange-400 text-white dark:bg-slate-200 dark:text-gray-900":
                    sort === "view",
                }
              )}
            >
              인기순
            </button>
            <button
              onClick={(e) => setSort("createdAt")}
              className={classNames(
                "button mx-0 rounded-none focus:outline-none focus:ring-0",
                {
                  "bg-orange-400 text-white dark:bg-slate-200 dark:text-gray-900":
                    sort === "createdAt",
                }
              )}
            >
              최신순
            </button>
          </div>
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
          <div className="flex ">
            <input
              {...register("value")}
              className=" form-input h-11 border-2 border-yellow-600 dark:border-gray-400 rounded-r-none "
              placeholder="검색값을 입력하세요."
              defaultValue={value}
            />
            <button className="button border-l-0 rounded-l-none mx-0 w-20">
              {searchExamMutation.isLoading ? "로딩" : "검색"}
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
      <div className="flex flex-wrap m-4 gap-2 justify-center">
        {exams &&
          exams.map((exam, key) => {
            return (
              <div key={`exam_index_${key}`}>
                <ExamCard
                  userId={exam.userId}
                  title={exam.title}
                  description={exam.description}
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
