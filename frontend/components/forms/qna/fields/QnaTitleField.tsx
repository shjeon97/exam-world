import classNames from "classnames";
import { FC } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { ISendQuestionInput } from "../../../../common/type";
import { FormError } from "../../FormError";

type Props = {
  register: UseFormRegister<ISendQuestionInput>;
  error?: FieldError;
};

export const QnaTitleField: FC<Props> = ({ register, error }) => {
  return (
    <div>
      <label>제목</label>
      <input
        type={"text"}
        className={classNames(`form-input`, {
          "border-red-500 focus:border-red-500 focus:outline-red-500": error,
        })}
        {...register("title", {
          required: "제목을 입력해 주세요.",
        })}
        placeholder="제목을 입력해 주세요."
      />
      {error && <FormError errorMessage={error.message} />}
    </div>
  );
};
