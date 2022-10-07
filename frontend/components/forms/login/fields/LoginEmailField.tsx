import classNames from "classnames";
import { FC } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { ILoginInput } from "../../../../common/type";

type Props = {
  register: UseFormRegister<ILoginInput>;
  error?: FieldError;
};

export const LoginEmaildField: FC<Props> = ({ register, error }) => (
  <div>
    <div>
      <div>
        <label htmlFor="email">email</label>
      </div>
    </div>
    <input
      type={"email"}
      className={classNames(`form-input`, {
        "border-red-500 focus:border-red-500 focus:outline-red-500": error,
      })}
      {...register("email", {
        required: "사용할 이메일 입력해 주세요.",
      })}
      placeholder="이메일"
    />
    {error && <div className="text-sm text-red-500">{error.message}</div>}
  </div>
);
