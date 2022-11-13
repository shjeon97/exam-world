import classNames from "classnames";
import { FC } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { ICreateExamInput } from "../../../../../common/type";
import { FormError } from "../../../FormError";

type Props = {
  register: UseFormRegister<ICreateExamInput>;
  error?: FieldError;
};

export const CreateExamTitleField: FC<Props> = ({ register, error }) => (
  <div>
    <label>제목</label>
    <div className=" text-xs  text-gray-500">
      시험의 제목을 입력하세요. (30자 이내)
    </div>
    <input
      type={"text"}
      className={classNames(`form-input`, {
        "border-red-500 focus:border-red-500 focus:outline-red-500": error,
      })}
      {...register("title", {
        required: "설명 입력해 주세요. (50자 이내)",
        maxLength: 50,
      })}
      placeholder="title"
    />
    {error && <FormError errorMessage={error.message} />}
  </div>
);
