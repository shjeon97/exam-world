import React, { useState } from "react";
import Image from "next/image";
import exam from "../public/image/exam.png";
import logout from "../public/image/logout.png";
import Link from "next/link";
import { useQuery } from "react-query";
import { apiMe } from "../common/api/axios";
import { Button } from "./buttom";
import { Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faRightToBracket,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export const Header: React.FC = () => {
  const { isLoading: meIsLoading, data: meData } = useQuery("me", apiMe);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="text-gray-600 body-font ">
        <nav className=" shadow-sm fixed w-full z-10">
          <div className="w-full">
            <div className="flex items-center h-20 w-full">
              <div className="flex items-center  mx-20  justify-between w-full">
                <div className="flex justify-center items-center flex-shrink-0 ">
                  <h1 className=" font-bold text-3xl cursor-pointer">
                    Exam World!
                  </h1>
                </div>
                <div className="hidden lg:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <Link href="/about">
                      <div className="button">시험목록</div>
                    </Link>
                    <Link href="/about">
                      <div className="button">Services</div>
                    </Link>
                    <Link href="/work">
                      <div className="button">Services</div>
                    </Link>

                    {!meIsLoading && meData ? (
                      <>
                        <div className="button "> 내 정보 </div>
                        <div className="button ">
                          <FontAwesomeIcon icon={faRightToBracket} /> 로그아웃
                        </div>
                      </>
                    ) : (
                      <>
                        <Link href="/login">
                          <button className="inline-flex items-center bg-gray-100 border-0 py-1.5 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                            <FontAwesomeIcon icon={faRightToBracket} />
                            <div className="button"> 로그인</div>
                          </button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="mr-10 flex lg:hidden ">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className=" inline-flex items-center justify-center rounded text-white "
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {!isOpen ? (
                    <div className="button">
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
                  ref={ref}
                  className="bg-white px-2 pt-2 pb-3 space-y-1 sm:px-3"
                >
                  <Link href="/home">
                    <div className="cursor-pointer hover:bg-gray-600 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                      Home
                    </div>
                  </Link>
                  <Link href="/home">
                    <div className="cursor-pointer hover:bg-gray-600 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                      Home
                    </div>
                  </Link>

                  <Link href="/home">
                    <div className="cursor-pointer hover:bg-gray-600 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                      Home
                    </div>
                  </Link>

                  {meData ? (
                    <>
                      <Link href="/home">
                        <div className="cursor-pointer hover:bg-gray-600 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                          내 정보
                        </div>
                      </Link>
                      <Link href="/home">
                        <div className="cursor-pointer hover:bg-gray-600 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                          <FontAwesomeIcon icon={faRightToBracket} /> 로그아웃
                        </div>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/home">
                        <div className="cursor-pointer hover:bg-gray-600 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                          <FontAwesomeIcon icon={faRightToBracket} />
                          <div className="button"> 로그아웃</div>
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
