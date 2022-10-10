import classNames from "classnames";
import { FC } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { useQuery } from "react-query";
import { apiGetMe } from "../../../../../api/axios";
import { IEditMeInput, IUserInput } from "../../../../../common/type";
import { FormError } from "../../../FormError";

type Props = {
  register: UseFormRegister<IEditMeInput>;
  error?: FieldError;
};

export const UserInfoNicknameField: FC<Props> = ({ register, error }) => {
  const { isLoading: meIsLoading, data: meData } = useQuery<IUserInput>(
    "me",
    apiGetMe
  );
  return (
    <>
      {!meIsLoading && meData && (
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
            defaultValue={meData.nickname}
          />
          {error && <FormError errorMessage={error.message} />}
        </div>
      )}
    </>
  );
};
