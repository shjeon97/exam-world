import classNames from "classnames";
import { FC } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { ISignupUserInput } from "../../../../common/type";
import { FormError } from "../../FormError";

type Props = {
  register: UseFormRegister<ISignupUserInput>;
  error?: FieldError;
};

export const SignupConfirmPasswordField: FC<Props> = ({ register, error }) => (
  <div>
    <input
      type={"password"}
      className={classNames(`form-input`, {
        "border-red-500 focus:border-red-500 focus:outline-red-500": error,
      })}
      {...register("confirmPassword", {
        required: "비밀번호 다시 입력해 주세요.",
        minLength: {
          value: 4,
          message: "비밀번호는 4자리 이상이여야 합니다.",
        },
      })}
      placeholder="confirm password"
    />
    {error && <FormError errorMessage={error.message} />}
  </div>
);
