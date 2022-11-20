import classNames from "classnames";
import { FC } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { IEditMeInput } from "../../../../../common/type";
import { FormError } from "../../../FormError";

type Props = {
  register: UseFormRegister<IEditMeInput>;
  error?: FieldError;
};

export const UserInfoConfirmEditPasswordField: FC<Props> = ({
  register,
  error,
}) => {
  return (
    <div>
      <div className=" text-xs  text-gray-500">
        변경할 비밀번호를 다시 입력하세요.
      </div>
      <input
        type={"password"}
        className={classNames(`form-input`, {
          "border-red-500 focus:border-red-500 focus:outline-red-500": error,
        })}
        {...register("confirmEditPassword", {
          minLength: {
            value: 4,
            message: "비밀번호는 4자리 이상이여야 합니다.",
          },
        })}
        placeholder="비밀번호 확인"
      />
      {error && <FormError errorMessage={error.message} />}
    </div>
  );
};
