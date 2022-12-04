import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "react-query";
import { apiGetMe } from "../../api/axios";
import { Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faRightToBracket,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { LOCAL_STORAGE_TOKEN } from "../../constant";
import { useRouter } from "next/router";
import { Toast } from "../../lib/sweetalert2/toast";
import { useTheme } from "next-themes";

export const NavigationBar: React.FC = () => {
  const queryClient = useQueryClient();
  let router = useRouter();
  const { theme, setTheme } = useTheme();

  const { isLoading: meIsLoading, data: meData } = useQuery("me", apiGetMe);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN);
    queryClient.invalidateQueries("me");
    window.location.reload();
  };

  const clickCreateExamButton = () => {
    if (!meIsLoading && !meData) {
      Toast.fire({
        icon: "error",
        title: `해당기능은 로그인이 필요합니다.`,
        position: "bottom-end",
        timer: 3000,
      });
    } else if (!meData.verified) {
      Toast.fire({
        icon: "error",
        title: `해당기능은 이메일 인증이 필요합니다.`,
        position: "bottom-end",
        timer: 3000,
      });
    } else {
      router.push("/exam");
    }
  };

  return (
    <>
      <header className="text-gray-700 body-font z-50 ">
        <nav className=" border-b-2 border-gray-900 fixed w-full z-50 bg-white dark:bg-gray-800">
          <div className="w-full">
            <div className="flex items-center h-16 py-1  w-full">
              <div className="flex items-center mx-2 mt-1 justify-between w-full">
                <div className="flex justify-center mb-2 items-center flex-shrink-0 ">
                  <h1 className=" font-bold text-3xl cursor-pointer dark:text-gray-100">
                    <Link href="/">Exam World!</Link>
                  </h1>
                </div>
                <div className="hidden lg:block">
                  <div className=" flex ">
                    <Link href="/">
                      <div className="button">시험목록</div>
                    </Link>
                    <div onClick={() => clickCreateExamButton()}>
                      <div className="button">내가 만든 시험</div>
                    </div>
                    <Link href="/qna">
                      <div className="button">문의</div>
                    </Link>
                  </div>
                </div>
                <div className="">
                  <button
                    type="button"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className=" text-gray-500 dark:text-gray-400"
                  >
                    {theme === "light" ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    )}
                  </button>
                </div>
                <div className="hidden lg:block">
                  {!meIsLoading && meData ? (
                    <div className="flex">
                      <Link href="/user/info">
                        <div className="button ">내 정보</div>
                      </Link>

                      <div onClick={() => handleLogout()} className="button ">
                        <FontAwesomeIcon icon={faRightToBracket} /> 로그아웃
                      </div>
                    </div>
                  ) : (
                    <>
                      <Link href="/login">
                        <button className="button">
                          <FontAwesomeIcon
                            className="mr-2"
                            icon={faRightToBracket}
                          />
                          로그인
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div className=" flex lg:hidden  ">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className=" inline-flex items-center justify-center rounded text-white"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  <div className="mt-2">
                    {!isOpen ? (
                      <div className="button ">
                        <FontAwesomeIcon
                          className="w-8 h-8 text-xl"
                          icon={faBars}
                        />
                      </div>
                    ) : (
                      <div className="button">
                        <FontAwesomeIcon
                          className="w-8 h-8 text-xl"
                          icon={faXmark}
                        />
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>

          <Transition
            show={isOpen}
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {(ref) => (
              <div
                className="lg:hidden border-2 border-gray-900 m-1 "
                id="mobile-menu"
              >
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  ref={ref}
                  className="bg-white px-2 pt-2 pb-3 space-y-1 sm:px-3  dark:bg-gray-900"
                >
                  <Link href="/">
                    <div className="cursor-pointer hover:bg-gray-600 dark:text-white text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                      시험목록
                    </div>
                  </Link>
                  <div onClick={() => clickCreateExamButton()}>
                    <div className="cursor-pointer hover:bg-gray-600 dark:text-white text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                      내가 만든 시험
                    </div>
                  </div>

                  <Link href="/qna">
                    <div className="cursor-pointer hover:bg-gray-600 dark:text-white text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                      문의
                    </div>
                  </Link>

                  {meData ? (
                    <>
                      <Link href="/user/info">
                        <div className="cursor-pointer hover:bg-gray-600 dark:text-white text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                          내 정보
                        </div>
                      </Link>
                      <div
                        onClick={() => handleLogout()}
                        className="cursor-pointer hover:bg-gray-600 dark:text-white text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      >
                        <FontAwesomeIcon icon={faRightToBracket} /> 로그아웃
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <div className="cursor-pointer hover:bg-gray-600 dark:text-white text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                          <FontAwesomeIcon
                            className="mr-2"
                            icon={faRightToBracket}
                          />
                          로그인
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </Transition>
        </nav>
      </header>
    </>
  );
};
