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

export const EditExamDescriptionField: FC<Props> = ({
  register,
  error,
  id,
}) => {
  const { isLoading: findExamByIdIsLoading, data: findExamByIdData } =
    useQuery<any>([`exam`, { id }], () => apiFindExamById(id));

  return (
    <>
      {!findExamByIdIsLoading && findExamByIdData && (
        <div>
          <label>설명</label>
          <div className=" text-xs  text-gray-500">
            시험에 관련된 설명을 자유롭게 쓰세요 (50자 이내)
          </div>
          <input
            type={"text"}
            className={classNames(`form-input`, {
              "border-red-500 focus:border-red-500 focus:outline-red-500":
                error,
            })}
            {...register("description", {
              required: "설명 입력해 주세요. (50자 이내)",
              maxLength: 50,
            })}
            placeholder="description"
            defaultValue={findExamByIdData?.exam?.description}
          />
          {error && <FormError errorMessage={error.message} />}
        </div>
      )}
    </>
  );
};
