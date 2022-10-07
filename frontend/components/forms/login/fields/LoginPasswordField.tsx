import classNames from "classnames";
import { FC } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { ILoginInput } from "../../../../common/type";

type Props = {
  register: UseFormRegister<ILoginInput>;
  error?: FieldError;
};

export const LoginPasswordField: FC<Props> = ({ register, error }) => (
  <div>
    <div>
      <div>
        <label htmlFor="password">password</label>
      </div>
    </div>
    <input
      type={"password"}
      className={classNames(`form-input`, {
        "border-red-500 focus:border-red-500 focus:outline-red-500": error,
      })}
      {...register("password", {
        required: "사용할 비밀번호 입력해 주세요.",
      })}
      placeholder="password"
    />
    {error && <div className="text-sm text-red-500">{error.message}</div>}
  </div>
);
