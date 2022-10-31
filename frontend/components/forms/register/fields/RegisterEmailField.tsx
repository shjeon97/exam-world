import classNames from "classnames";
import { FC } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { ISignupUserInput } from "../../../../common/type";
import { FormError } from "../../FormError";

type Props = {
  register: UseFormRegister<ISignupUserInput>;
  error?: FieldError;
};

export const RegisterEmailField: FC<Props> = ({ register, error }) => (
  <div>
    <input
      type={"email"}
      className={classNames(`form-input`, {
        "border-red-500 focus:border-red-500 focus:outline-red-500": error,
      })}
      {...register("email", {
        required: "사용할 이메일 입력해 주세요.",
      })}
      placeholder="email"
    />
    {error && <FormError errorMessage={error.message} />}
  </div>
);
