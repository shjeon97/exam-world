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

export const EditExamTitleField: FC<Props> = ({ register, error, id }) => {
  const { isLoading: findExamByIdIsLoading, data: findExamByIdData } =
    useQuery<any>([`exam-by-id`, id], () =>
      apiFindExamById(Object.values(id)[0])
    );

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
            {...register("title", {
              required: "설명 입력해 주세요. (50자 이내)",
              maxLength: 50,
            })}
            placeholder="title"
            defaultValue={findExamByIdData?.exam?.title}
          />
          {error && <FormError errorMessage={error.message} />}
        </div>
      )}
    </>
  );
};
