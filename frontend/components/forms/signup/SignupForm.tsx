import { useForm } from "react-hook-form";
import { FormButton } from "../FormButton";
import { useMutation } from "react-query";
import { apiSignupUser as apiSignupUser } from "../../../api/axios";
import { ICoreOutput, ISignupUserInput } from "../../../common/type";
import { FormError } from "../FormError";
import { useRouter } from "next/router";
import { Toast } from "../../../lib/sweetalert2/toast";
import { SignupEmailField } from "./fields/SignupEmailField";
import { SignupNicknameField } from "./fields/SignupNicknameField";
import { SignupPasswordField } from "./fields/SignupPasswordField";
import { useRef, useState } from "react";
import { SignupConfirmPasswordField } from "./fields/SignupConfirmPasswordField";

export const SignupForm = () => {
  const [policyChecked, setPolicyChecked] = useState(false);

  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
    watch,
  } = useForm<ISignupUserInput>({ mode: "onChange" });

  const password = useRef({});
  password.current = watch("password", "");
  let router = useRouter();
  const signupUserMutation = useMutation(apiSignupUser, {
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

  const checkHandler = () => {
    setPolicyChecked(!policyChecked);
  };

  const onSubmit = () => {
    if (!signupUserMutation.isLoading) {
      const registerUser = getValues();
      if (registerUser.confirmPassword !== registerUser.password) {
        Toast.fire({
          icon: "error",
          title: "비밀번호가 일치하지 않습니다",
        });
      } else {
        signupUserMutation.mutate(registerUser);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SignupEmailField register={register} error={errors.email} />
      <SignupNicknameField register={register} error={errors.nickname} />
      <SignupPasswordField register={register} error={errors.password} />
      <SignupConfirmPasswordField
        register={register}
        error={errors.confirmPassword}
      />

      <div className="flex my-4 items-center text-md ">
        <input
          type="checkbox"
          className="ml-1 w-6 h-6 text-blue-600 hover:cursor-pointer  rounded-full bg-gray-200  border-gray-500  "
          id="checkbox"
          checked={policyChecked}
          onChange={() => checkHandler()}
        />
        <label
          className="ml-2 text-xl items-center hover:cursor-pointer"
          htmlFor="checkbox"
        >
          개인정보 수집 및 이용 동의
        </label>
      </div>
      <FormButton
        canClick={isValid && policyChecked}
        loading={signupUserMutation.isLoading}
        actionText={"signup"}
      />
      {signupUserMutation?.data?.error && (
        <FormError errorMessage={signupUserMutation.data.error} />
      )}
    </form>
  );
};
