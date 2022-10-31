import { useForm } from "react-hook-form";
import { FormButton } from "../FormButton";
import { useMutation } from "react-query";
import { apiSignupUser as apiSignupUser } from "../../../api/axios";
import { ICoreOutput, ISignupUserInput } from "../../../common/type";
import { FormError } from "../FormError";
import { useRouter } from "next/router";
import { Toast } from "../../../lib/sweetalert2/toast";
import { RegisterEmailField } from "./fields/RegisterEmailField";
import { RegisterNicknameField } from "./fields/RegisterNicknameField";
import { RegisterPasswordField } from "./fields/RegisterPasswordField";

export const RegisterForm = () => {
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<ISignupUserInput>({ mode: "onChange" });
  let router = useRouter();
  const registerUserMutation = useMutation(apiSignupUser, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Toast.fire({
          icon: "success",
          title: "회원가입 완료되었습니다.",
          position: "top-end",
        });
        router.push("/login");
      }
    },
  });

  const onSubmit = () => {
    if (!registerUserMutation.isLoading) {
      const registerUser = getValues();
      registerUserMutation.mutate(registerUser);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RegisterEmailField register={register} error={errors.email} />
      <RegisterNicknameField register={register} error={errors.nickname} />
      <RegisterPasswordField register={register} error={errors.password} />

      <FormButton
        canClick={isValid}
        loading={registerUserMutation.isLoading}
        actionText={"register"}
      />
      {registerUserMutation?.data?.error && (
        <FormError errorMessage={registerUserMutation.data.error} />
      )}
    </form>
  );
};
