import classNames from "classnames";
import { FC } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { IRegisterUserInput } from "../../../../common/type";
import { FormError } from "../../FormError";

type Props = {
  register: UseFormRegister<IRegisterUserInput>;
  error?: FieldError;
};

export const RegisterPasswordField: FC<Props> = ({ register, error }) => (
  <div>
    <input
      type={"password"}
      className={classNames(`form-input`, {
        "border-red-500 focus:border-red-500 focus:outline-red-500": error,
      })}
      {...register("password", {
        required: "사용할 비밀번호 입력해 주세요.",
        minLength: {
          value: 4,
          message: "비밀번호는 4자리 이상이여야 합니다.",
        },
      })}
      placeholder="password"
    />
    {error && <FormError errorMessage={error.message} />}
  </div>
);
