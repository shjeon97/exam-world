import { useForm } from "react-hook-form";
import { FormButton } from "../FormButton";
import { LoginPasswordField } from "./fields/LoginPasswordField";
import { LoginEmailField } from "./fields/LoginEmailField";
import { useMutation, useQueryClient } from "react-query";
import { apiLogin } from "../../../api/axios";
import { LOCAL_STORAGE_TOKEN } from "../../../constant";
import { ILoginInput, ILoginOutput } from "../../../common/type";
import { FormError } from "../FormError";

export const LoginForm = () => {
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<ILoginInput>({
    mode: "onChange",
  });

  const queryClient = useQueryClient();

  const loginMutation = useMutation(apiLogin, {
    onSuccess: (data: ILoginOutput) => {
      if (data.ok && data.token) {
        localStorage.setItem(LOCAL_STORAGE_TOKEN, data.token);
        queryClient.invalidateQueries("me");
      }
    },
  });

  const onSubmit = () => {
    if (!loginMutation.isLoading) {
      const user = getValues();
      loginMutation.mutate(user);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <LoginEmailField register={register} error={errors.email} />
      <LoginPasswordField register={register} error={errors.password} />
      <FormButton
        canClick={isValid}
        loading={loginMutation.isLoading}
        actionText={"login"}
      />
      {loginMutation?.data?.error && (
        <FormError errorMessage={loginMutation.data.error} />
      )}
    </form>
  );
};
