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
        <title className=" text-gray-800">{WEB_TITLE}</title>
      </Head>
      <div className=" items-center justify-center flex lg:text-lg text-md ">
        <form
          className=" mt-4 flex flex-wrap gap-3 "
          onSubmit={handleSubmit(onSearchSubmit)}
        >
          <div className="flex">
            <button
              onClick={(e) => setSort("view")}
              className={classNames(
                "button py-1.5 px-2 m-0 rounded-none border-2 border-r-0 lg:text-lg text-md",
                {
                  "bg-slate-900 text-white": sort === "view",
                }
              )}
            >
              인기순
            </button>
            <button
              onClick={(e) => setSort("createdAt")}
              className={classNames(
                "button py-1.5 m-0 rounded-none px-2 border-2 lg:text-lg text-md",
                { "bg-slate-900 text-white": sort === "createdAt" }
              )}
            >
              최신순
            </button>
          </div>
          <div className="flex">
            <div className="focus:outline-none text-gray-800  py-1.5 px-2 select-none border-2 border-gray-900 border-r-0">
              검색대상
            </div>
            <select
              {...register("type")}
              className="border-2 border-gray-900 rounded-r-md dark:bg-gray-100"
            >
              <option value="title">제목</option>
              <option value="description">부가설명</option>
            </select>
          </div>
          <div className="flex ">
            <input
              {...register("value")}
              className=" border-2 border-gray-900 shadow-inner dark:bg-gray-100  focus: outline-none   py-1 px-3 rounded-md rounded-r-none "
              placeholder="검색값을 입력하세요."
              defaultValue={value}
            />
            <div className="focus:outline-none text-gray-800 py-1.5 px-2 select-none border-2 border-gray-900 border-l-0 hover:bg-gray-200">
              <button>
                {searchExamMutation.isLoading ? "Loading..." : "검색"}
              </button>
            </div>
          </div>

          <div
            onClick={() => {
              window.location.reload();
            }}
            className="focus:outline-none text-gray-800 py-1.5 px-3 select-none border-2 border-gray-900  hover:bg-gray-200"
          >
            전체
          </div>
        </form>
      </div>
      <div className="flex flex-wrap m-4 gap-2 ">
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
