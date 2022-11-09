import classNames from "classnames";
import { FC } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { useQuery } from "react-query";
import { apiFindExamById } from "../../../../../../api/axios";
import { IEditExamInput } from "../../../../../../common/type";
import { FormError } from "../../../../FormError";

type Props = {
  register: UseFormRegister<IEditExamInput>;
  error?: FieldError;
  id: number;
};

export const EditExamTitleField: FC<Props> = ({ register, error, id }) => {
  const { isLoading: findExamByIdIsLoading, data: findExamByIdData } =
    useQuery<any>([`exam-by-id`, id], () => apiFindExamById(id));
  return (
    <>
      {!findExamByIdIsLoading && findExamByIdData && (
        <div>
          <label>제목</label>
          <div className=" text-xs  text-gray-500">
            시험의 제목을 입력하세요. 예) 자동차 2종보통
          </div>
          <input
            type={"text"}
            className={classNames(`form-input`, {
              "border-red-500 focus:border-red-500 focus:outline-red-500":
                error,
            })}
            {...register("title", {
              required: "사용할 제목 입력해 주세요. (30자 이내)",
              maxLength: 30,
            })}
            placeholder="title"
            defaultValue={findExamByIdData?.exam?.title}
          />
          {error && <FormError errorMessage={error.message} />}
        </div>
      )}
    </>
  );
};
