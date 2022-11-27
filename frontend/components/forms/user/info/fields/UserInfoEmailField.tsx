import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

export const UserInfoEmailField: FC<Props> = ({ register, error }) => {
  const { isLoading, data } = useMe();

  return (
    <>
      {!isLoading && data && (
        <div>
          <div className="flex flex-row justify-between ">
            <label>이메일</label>
            <div>
              인증{" "}
              {data.verified ? (
                <FontAwesomeIcon
                  className=" text-green-500"
                  icon={faCircleCheck}
                />
              ) : (
                <FontAwesomeIcon
                  className=" text-red-500"
                  icon={faCircleXmark}
                />
              )}
            </div>
          </div>
          <input
            type={"email"}
            className={classNames(`form-input`, {
              "border-red-500 focus:border-red-500 focus:outline-red-500":
                error,
            })}
            {...register("email", {
              required: "사용할 이메일 입력해 주세요.",
            })}
            placeholder="email"
            defaultValue={data.email}
          />
          {error && <FormError errorMessage={error.message} />}
        </div>
      )}
    </>
  );
};
