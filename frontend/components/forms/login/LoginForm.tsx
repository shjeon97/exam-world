import { useForm } from "react-hook-form";
import { FormButton } from "../form-button";
import { LoginPasswordField } from "./fields/LoginPasswordField";
import { LoginEmaildField } from "./fields/LoginEmailField";
import { useMutation, useQueryClient } from "react-query";
import { apiLogin } from "../../../api/axios";
import { LOCALSTORAGE_TOKEN } from "../../../constant";
import { ILoginInput, ILoginOutput } from "../../../common/type";
import { FormError } from "../form-error";

export const LgoinForm = () => {
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
      console.log(data);

      if (data.ok && data.token) {
        localStorage.setItem(LOCALSTORAGE_TOKEN, data.token);
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
      <LoginEmaildField register={register} error={errors.email} />
      <LoginPasswordField register={register} error={errors.password} />
      <FormButton
        canClick={isValid}
        loading={loginMutation.isLoading}
        actionText={"로그인"}
      />
      {loginMutation?.data?.error && (
        <FormError errorMessage={loginMutation.data.error} />
      )}
    </form>
  );
};
