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

export const NavigationBar: React.FC = () => {
  const queryClient = useQueryClient();
  let router = useRouter();

  const { isLoading: meIsLoading, data: meData } = useQuery("me", apiGetMe);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN);
    queryClient.invalidateQueries("me");
  };

  const clickCreateExamButton = () => {
    if (!meIsLoading && !meData) {
      alert("해당기능은 로그인이 필요합니다.");
    } else {
      router.push("/exam");
    }
  };

  return (
    <>
      <header className="text-gray-600 body-font z-50 ">
        <nav className=" border-b-2 border-gray-900 fixed w-full z-50 bg-white">
          <div className="w-full">
            <div className="flex items-center h-16 py-1  w-full">
              <div className="flex items-center mx-2 mt-1 justify-between w-full">
                <div className="flex justify-center mb-2 items-center flex-shrink-0 ">
                  <h1 className=" font-bold text-3xl cursor-pointer">
                    <Link href="/">Exam World! </Link>
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
              <div className=" flex lg:hidden ">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className=" inline-flex items-center justify-center rounded text-white "
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
                className="lg:hidden border-2 border-gray-900 mx-1"
                id="mobile-menu"
              >
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  ref={ref}
                  className="bg-white px-2 pt-2 pb-3 space-y-1 sm:px-3"
                >
                  <Link href="/">
                    <div className="cursor-pointer hover:bg-gray-600 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                      시험목록
                    </div>
                  </Link>
                  <div onClick={() => clickCreateExamButton()}>
                    <div className="cursor-pointer hover:bg-gray-600 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                      내가 만든 시험
                    </div>
                  </div>

                  <Link href="/qna">
                    <div className="cursor-pointer hover:bg-gray-600 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                      문의
                    </div>
                  </Link>

                  {meData ? (
                    <>
                      <Link href="/user/info">
                        <div className="cursor-pointer hover:bg-gray-600 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                          내 정보
                        </div>
                      </Link>
                      <div
                        onClick={() => handleLogout()}
                        className="cursor-pointer hover:bg-gray-600 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      >
                        <FontAwesomeIcon icon={faRightToBracket} /> 로그아웃
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <div className="cursor-pointer hover:bg-gray-600 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
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
