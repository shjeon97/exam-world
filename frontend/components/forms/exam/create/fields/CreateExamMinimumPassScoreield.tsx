import classNames from "classnames";
import { FC } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { ICreateExamInput } from "../../../../../common/type";
import { FormError } from "../../../FormError";

type Props = {
  register: UseFormRegister<ICreateExamInput>;
  error?: FieldError;
};

export const CreateExamMinimumPassScoreField: FC<Props> = ({
  register,
  error,
}) => (
  <div>
    <label>최소 합격점수</label>
    <div className=" text-xs  text-gray-500">0점 일시 없음으로 적용됩니다.</div>
    <input
      type={"number"}
      className={classNames(`form-input`, {
        "border-red-500 focus:border-red-500 focus:outline-red-500": error,
      })}
      {...register("minimumPassScore", {
        required: "최소 합격점수를 입력해 주세요. ",
      })}
      defaultValue={0}
    />
    {error && <FormError errorMessage={error.message} />}
  </div>
);
