import classNames from "classnames";
import { FC } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { useQuery } from "react-query";
import { apiFindExamById } from "../../../../../../api/axios";
import { IEditExamInput } from "../../../../../../common/type";
import { FormError } from "../../../../FormError";

type Props = {
  register: UseFormRegister<IEditExamInput>;
  error?: FieldError;
  id: number;
};

export const EditExamTimeField: FC<Props> = ({ register, error, id }) => {
  const { isLoading: findExamByIdIsLoading, data: findExamByIdData } =
    useQuery<any>([`exam`, { id }], () => apiFindExamById(id));

  return (
    <>
      {!findExamByIdIsLoading && findExamByIdData && (
        <div>
          <label>제한시간 (초)</label>
          <div className=" text-xs  text-gray-500">
            0초 일시 제한시간 없음으로 적용됩니다.
          </div>
          <input
            type={"number"}
            className={classNames(`form-input`, {
              "border-red-500 focus:border-red-500 focus:outline-red-500":
                error,
            })}
            {...register("time", {
              required: "제한시간을 입력해 주세요. ",
            })}
            defaultValue={findExamByIdData?.exam?.time}
          />
          {error && <FormError errorMessage={error.message} />}
        </div>
      )}
    </>
  );
};
