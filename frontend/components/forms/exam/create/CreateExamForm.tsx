import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useRouter } from "next/router";
import { ICreateExamInput, ICreateExamOutput } from "../../../../common/type";
import { apiCreateExam } from "../../../../api/axios";
import { CreateExamDescriptionField as CreateExamDescriptionField } from "./fields/CreateExamDescriptionField";
import { CreateExamTitleField } from "./fields/CreateExamTitleField";
import { FormButton } from "../../FormButton";
import { FormError } from "../../FormError";
import { CreateExamTimeField } from "./fields/CreateExamTimeField";
import { CreateExamMinimumPassScoreField } from "./fields/CreateExamMinimumPassScoreield";

export const CreateExamForm = () => {
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<ICreateExamInput>({ mode: "onChange" });
  let router = useRouter();

  const createExamMutation = useMutation(apiCreateExam, {
    onSuccess: async (data: ICreateExamOutput) => {
      if (data.ok) {
        router.push(`/exam/${data.examId}/info`);
      }
    },
  });

  const onSubmit = () => {
    const createExamValues = getValues();
    createExamMutation.mutate(createExamValues);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CreateExamTitleField register={register} error={errors.title} />
      <CreateExamDescriptionField
        register={register}
        error={errors.description}
      />
      <CreateExamTimeField register={register} error={errors.time} />
      <CreateExamMinimumPassScoreField
        register={register}
        error={errors.minimumPassScore}
      />
      <FormButton
        canClick={isValid}
        loading={createExamMutation.isLoading}
        actionText={"create"}
      />
      {createExamMutation?.data?.error && (
        <FormError errorMessage={createExamMutation.data.error} />
      )}
    </form>
  );
};
