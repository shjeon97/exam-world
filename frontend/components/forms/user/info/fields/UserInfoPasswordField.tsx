import classNames from "classnames";
import { FC } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { IEditMeInput } from "../../../../../common/type";
import { FormError } from "../../../FormError";

type Props = {
  register: UseFormRegister<IEditMeInput>;
  error?: FieldError;
};

export const UserInfoPasswordField: FC<Props> = ({ register, error }) => (
  <div>
    <label>비밀번호</label>
    <div className=" text-xs  text-gray-500">
      정보를 변경 및 탈퇴하려면 현재 비밀번호를 입력하세요.
    </div>
    <input
      type={"password"}
      className={classNames(`form-input`, {
        "border-red-500 focus:border-red-500 focus:outline-red-500": error,
      })}
      {...register("password", {
        required: "기존 비밀번호 입력해 주세요.",
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
