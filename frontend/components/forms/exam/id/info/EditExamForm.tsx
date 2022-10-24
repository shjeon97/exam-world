import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { EditExamNameField } from "./fields/EditExamNameField";
import { EditExamTitleField } from "./fields/EditExamTitleField";
import { FormButton } from "../../../FormButton";
import { FormError } from "../../../FormError";
import { ICoreOutput, IEditExamInput } from "../../../../../common/type";
import { apiEditExam } from "../../../../../api/axios";
import { Toast } from "../../../../../lib/sweetalert2/toast";
import { EditExamTimeField } from "./fields/EditExamTimeField";
import { EditExamMinimumPassScoreField } from "./fields/EditExamMinimumPassScoreield";

export const EditExamForm = (id) => {
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IEditExamInput>({ mode: "onChange" });

  const editExamMutation = useMutation(apiEditExam, {
    onSuccess: async (data: ICoreOutput) => {
      if (data.ok) {
        Toast.fire({
          icon: "success",
          title: "수정 완료",
          position: "top-end",
          timer: 1200,
        });
      }
    },
  });

  const onSubmit = () => {
    const editExamValues = getValues();

    editExamMutation.mutate({ id: Object.values(id)[0], ...editExamValues });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <EditExamNameField register={register} error={errors.name} id={id} />
      <EditExamTitleField register={register} error={errors.title} id={id} />
      <EditExamTimeField register={register} error={errors.time} id={id} />
      <EditExamMinimumPassScoreField
        register={register}
        error={errors.minimumPassScore}
        id={id}
      />
      <br />
      <FormButton
        canClick={isValid}
        loading={editExamMutation.isLoading}
        actionText={"저장"}
      />
      {editExamMutation?.data?.error && (
        <FormError errorMessage={editExamMutation.data.error} />
      )}
    </form>
  );
};
