import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { ICoreOutput, IEditMeInput, IUserInput } from "../../../../common/type";
import { apiDeleteMe, apiEditMe, apiGetMe } from "../../../../api/axios";
import { Toast } from "../../../../lib/sweetalert2/toast";
import Swal from "sweetalert2";
import { UserInfoEmailField } from "./fields/UserInfoEmailField";
import { UserInfoNicknameField } from "./fields/UserInfoNicknameField";
import { UserInfoPasswordField } from "./fields/UserInfoPasswordField";
import { UserInfoEditPasswordField } from "./fields/UserInfoEditPasswordField";
import { FormButton } from "../../FormButton";
import { FormError } from "../../FormError";
import classNames from "classnames";
import { UserInfoConfirmEditPasswordField } from "./fields/UserInfoConfirmEditPasswordField";
import { useMe } from "../../../../hooks/useMe";

export const UserInfoForm = () => {
  const {
    register,
    getValues,
    setValue,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IEditMeInput>({ mode: "onChange" });
  const queryClient = useQueryClient();
  let router = useRouter();

  const editMeMutation = useMutation(apiEditMe, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Toast.fire({
          icon: "success",
          title: `정보 수정완료!`,
          position: "top-end",
          timer: 2000,
        });
        queryClient.invalidateQueries("me");
      }
    },
  });

  const deleteMeMutation = useMutation(apiDeleteMe, {
    onSuccess: async (data: ICoreOutput) => {
      if (data) {
        await Toast.fire({
          icon: "success",
          title: `탈퇴가 완료되었습니다.`,
          position: "top-end",
          timer: 3000,
        });
        queryClient.invalidateQueries("me");
      }
    },
  });

  useMe();

  const onSubmit = () => {
    if (!editMeMutation.isLoading) {
      const editUser = getValues();
      if (
        editUser.confirmEditPassword &&
        editUser.confirmEditPassword !== editUser.editPassword
      ) {
        Toast.fire({
          icon: "error",
          title: "변경할 비밀번호가 일치하지 않습니다",
        });
      } else {
        editMeMutation.mutate(editUser);
      }
    }
  };

  const handleDeleteUser = () => {
    Swal.fire({
      title: "Are you sure?",
      html: "정말 탈퇴하기를 원하십니까? <br> 탈퇴 후 기존 모든 정보는 복구가 불가능합니다.",
      icon: "warning",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "탈퇴하기",
      showCancelButton: true,
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMeMutation.mutate({ password: getValues().password });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <UserInfoEmailField register={register} error={errors.email} />
      <UserInfoNicknameField register={register} error={errors.nickname} />
      <UserInfoPasswordField register={register} error={errors.password} />
      <UserInfoEditPasswordField
        register={register}
        setValue={setValue}
        error={errors.editPassword}
      />
      <UserInfoConfirmEditPasswordField
        register={register}
        error={errors.confirmEditPassword}
      />
      <div className=" grid grid-cols-2 gap-4">
        <FormButton
          canClick={isValid}
          loading={false}
          actionText={"정보 수정"}
        />
        <div
          className={classNames(
            `hover:cursor-pointer text-center bg-red-600 hover:bg-red-500  w-full select-none font-medium focus:outline-none text-white py-2  transition-colors `,
            {
              " pointer-events-none bg-gray-400": !getValues().password,
            }
          )}
          onClick={() => handleDeleteUser()}
        >
          탈퇴하기
        </div>
      </div>
      {editMeMutation?.data?.error && (
        <FormError errorMessage={editMeMutation.data.error} />
      )}
      {deleteMeMutation?.data?.error && (
        <FormError errorMessage={deleteMeMutation.data.error} />
      )}
    </form>
  );
};
