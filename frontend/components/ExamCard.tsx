import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import Swal from "sweetalert2";
import { apiDeleteExam, apiGetMe } from "../api/axios";
import { ICoreOutput, IUserInput } from "../common/type";
import { Toast } from "../lib/sweetalert2/toast";
import { LinkButton } from "./buttons/LinkButton";

interface ILinkCardProp {
  userId: number;
  userNickName: string;
  title: string;
  description?: string;
  id: number;
  time?: number;
}

export const ExamCard: React.FC<ILinkCardProp> = ({
  userId,
  userNickName,
  id,
  title,
  description,
  time,
}) => {
  const [isHidden, setIsHidden] = useState(false);
  const { isLoading: meIsLoading, data: meData } = useQuery<IUserInput>(
    "me",
    apiGetMe
  );

  const deleteExamMutation = useMutation(apiDeleteExam, {
    onSuccess: async (data: ICoreOutput) => {
      if (data) {
        setIsHidden(true);
        await Toast.fire({
          icon: "success",
          title: `삭제가 완료되었습니다.`,
          position: "top-end",
          timer: 3000,
        });
      }
    },
  });
  const deleteExamById = () => {
    Swal.fire({
      title: "Are you sure?",
      html: "정말 삭제하기를 원하십니까? <br> 삭제 후 기존 모든 정보는 복구가 불가능합니다.",
      icon: "warning",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "삭제하기",
      showCancelButton: true,
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteExamMutation.mutate(id);
      }
    });
  };

  return (
    <div
      className={`${
        isHidden && "hidden"
      } p-1 border-2 border-yellow-600 grid grid-rows-1 grid-col-10 dark:border-gray-400 w-72 h-auto rounded `}
    >
      <div>
        <div className="flex flex-col pt-3 pl-3 ">
          <div className="flex flex-col">
            <span className="text-md font-bold text-gray-800 dark:text-gray-100">
              {title}
            </span>
            {time > 0 && <span className="text-sm">제한시간 : {time}초</span>}
          </div>

          <p className="mt-2 text-sm text-gray-500 ">{description} </p>
        </div>
      </div>

      <div className="text-sm m-2">작성자 : {userNickName}</div>
      <div className="flex m-2 gap-1">
        <div className="text-xs text-center">
          <LinkButton name="시험시작" link={`/exam/${id}/test`} />
        </div>
        <div className="text-xs  text-center">
          <LinkButton name="댓글" link={`/exam/${id}/comment`} />
        </div>
        {!meIsLoading && meData?.id === userId && (
          <>
            <div className="text-xs  text-center">
              <LinkButton name="정보" link={`/exam/${id}/info`} />
            </div>
            <div
              onClick={() => deleteExamById()}
              className="text-xs w-12 text-center"
            >
              <div className="block h-auto group w-auto  hover:cursor-pointer ">
                <div className="relative inset-0  transition bg-red-600  border-2 border-red-400 group-hover:-translate-x group-hover:-translate-y rounded group-hover:shadow-[2px_2px_0_0_#000] p-2 ">
                  <span className=" text-gray-50  font-semibold">삭제</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
