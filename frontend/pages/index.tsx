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
  const [exams, setExams] = useState<IExam[]>(null);
  const [searchType, setSearchType] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
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
      "search-type": searchType ? searchType : null,
      "search-value": searchValue ? searchValue : null,
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
      const { searchType, searchValue } = getValues();
      setSearchType(searchType);
      setSearchValue(searchValue);

      flushSync(() => {
        setExams(null);
      });
      searchExamMutation.mutate({
        page: 1,
        "page-size": pageSize,
        "search-type": searchType,
        "search-value": searchValue,
      });
    }
  };

  return (
    <div className=" min-h-screen">
      <Head>
        <title className=" text-gray-800">{WEB_TITLE}</title>
      </Head>
      <div className=" items-center justify-center flex text-lg ">
        <form
          className=" mt-4 flex flex-wrap gap-4 "
          onSubmit={handleSubmit(onSearchSubmit)}
        >
          <div className="flex">
            <div className="focus:outline-none text-gray-800  py-1.5 px-3 select-none border-2 border-gray-900 border-r-0">
              검색대상
            </div>
            <select
              {...register("searchType")}
              className="border-2 border-gray-900 py-1 px-3  rounded-r-md "
            >
              <option value="name">제목</option>
              <option value="title">부가설명</option>
            </select>
          </div>
          <div className="flex">
            <input
              {...register("searchValue")}
              className=" border-2 border-gray-900 shadow-inner  focus: outline-none   py-1 px-3 rounded-md rounded-r-none "
              placeholder="검색값을 입력하세요."
              defaultValue={searchValue}
            />
            <div className="focus:outline-none text-gray-800 py-1.5 px-3 select-none border-2 border-gray-900 border-l-0 hover:bg-gray-200">
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
