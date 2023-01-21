import classNames from "classnames";
import React, { useState } from "react";
import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import { IFormSearchInput } from "../../../common/type";
import { PageSize } from "../../../constant";

interface IExamSearchFormProp {
  mutation: any;
  setExams: any;
  setType: any;
  type: string;
  setValue: any;
  value: string;
  sort?: string;
  setSort?: any;
}
export const ExamSearchForm: React.FC<IExamSearchFormProp> = ({
  mutation,
  setExams,
  setType,
  type,
  setValue,
  value,
  setSort,
  sort,
}) => {
  const { register, handleSubmit, getValues } = useForm<IFormSearchInput>({
    mode: "onChange",
  });

  const onSearchSubmit = () => {
    if (!mutation.isLoading) {
      const { type, value } = getValues();
      setType(type);
      setValue(value);
      flushSync(() => {
        setExams(null);
      });
      mutation.mutate({
        page: 1,
        "page-size": PageSize,
        type,
        value,
        ...(sort && { sort }),
      });
    }
  };

  return (
    <div className=" items-center justify-center flex lg:text-lg text-md ">
      <form
        className=" mt-4 flex flex-wrap gap-1 "
        onSubmit={handleSubmit(onSearchSubmit)}
      >
        {sort && (
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
        )}

        <div className="flex">
          <div className="button focus:outline-none rounded-r-none border-r-0 mr-0 ">
            검색대상
          </div>
          <select
            {...register("type")}
            className="form-input text-sm w-28 h-11 mx-0 dark:border-gray-400 justify-center border-2 border-yellow-600 "
          >
            {type === "title" ? (
              <option value="title" selected>
                제목
              </option>
            ) : (
              <option value="title">제목</option>
            )}
            {type === "description" ? (
              <option value="description" selected>
                부가설명
              </option>
            ) : (
              <option value="description">부가설명</option>
            )}
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
            {mutation.isLoading ? "로딩" : "검색"}
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
  );
};
