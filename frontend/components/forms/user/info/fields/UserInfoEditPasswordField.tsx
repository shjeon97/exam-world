import classNames from "classnames";
import { FC, useState } from "react";
import { UseFormRegister, FieldError, UseFormSetValue } from "react-hook-form";
import { IEditMeInput } from "../../../../../common/type";
import { FormError } from "../../../FormError";

type Props = {
  register: UseFormRegister<IEditMeInput>;
  setValue: UseFormSetValue<IEditMeInput>;
  error?: FieldError;
};

export const UserInfoEditPasswordField: FC<Props> = ({
  register,
  setValue,
  error,
}) => {
  const [editPasswordCheck, setEditPasswordCheck] = useState<boolean>(false);

  if (!editPasswordCheck) {
    setValue("editPassword", null);
  }
  return (
    <div>
      <label>
        <input
          type="checkbox"
          name="color"
          value="blue"
          checked={editPasswordCheck}
          onChange={(e) => setEditPasswordCheck(e.target.checked)}
        />{" "}
        비밀번호 변경
      </label>
      <div className=" text-xs  text-gray-500">
        변경할 비밀번호를 입력하세요.
      </div>
      <input
        type={"password"}
        className={classNames(`form-input`, {
          "pointer-events-none": !editPasswordCheck,
          "border-red-500 focus:border-red-500 focus:outline-red-500": error,
        })}
        {...register("editPassword", {
          minLength: {
            value: 4,
            message: "비밀번호는 4자리 이상이여야 합니다.",
          },
        })}
        placeholder="비밀번호"
      />
      {error && <FormError errorMessage={error.message} />}
    </div>
  );
};
