import classNames from "classnames";
import { FC } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { ILoginInput, ISendQuestionInput } from "../../../../common/type";
import { FormError } from "../../FormError";

type Props = {
  register: UseFormRegister<ISendQuestionInput>;
  error?: FieldError;
};

export const QnaEmailField: FC<Props> = ({ register, error }) => (
  <div>
    <label>이메일</label>
    <input
      type={"email"}
      className={classNames(`form-input`, {
        "border-red-500 focus:border-red-500 focus:outline-red-500": error,
      })}
      {...register("email", {
        required: "답변받을 이메일 입력해 주세요.",
      })}
      placeholder="답변받을 이메일 입력해 주세요."
    />
    {error && <FormError errorMessage={error.message} />}
  </div>
);
