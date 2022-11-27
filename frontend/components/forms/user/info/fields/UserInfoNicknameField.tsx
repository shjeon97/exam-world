import classNames from "classnames";
import { FC } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { IEditMeInput } from "../../../../../common/type";
import { useMe } from "../../../../../hooks/useMe";
import { FormError } from "../../../FormError";

type Props = {
  register: UseFormRegister<IEditMeInput>;
  error?: FieldError;
};

export const UserInfoNicknameField: FC<Props> = ({ register, error }) => {
  const { isLoading, data } = useMe();

  return (
    <>
      {!isLoading && data && (
        <div>
          <label>닉네임</label>
          <input
            type={"text"}
            className={classNames(`form-input`, {
              "border-red-500 focus:border-red-500 focus:outline-red-500":
                error,
            })}
            {...register("nickname", {
              required: "사용할 닉네임 입력해 주세요.",
              minLength: {
                value: 4,
                message: "닉네임은 4자리 이상 10자리 이하여야 합니다.",
              },
              maxLength: {
                value: 10,
                message: "닉네임은 4자리 이상 10자리 이하여야 합니다.",
              },
            })}
            placeholder="nickname"
            defaultValue={data.nickname}
          />
          {error && <FormError errorMessage={error.message} />}
        </div>
      )}
    </>
  );
};
