import React from "react";
import Image from "next/image";
import exam from "../public/image/exam.png";
import logout from "../public/image/logout.png";
import Link from "next/link";
import { Menu } from "@headlessui/react";
import { useQuery } from "react-query";
import { apiMe } from "../common/api/axios";
import { Button } from "./buttom";

export const Header: React.FC = () => {
  const { isLoading: meIsLoading, data: meData } = useQuery("me", apiMe);

  return (
    <>
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <Link href="/">
            <div className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0 hover:cursor-pointer">
              <Image src={exam} width={40} height={40} />
              <span className="ml-3 text-xl">Exam World!</span>
            </div>
          </Link>
          <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
            <a className="mr-5 hover:text-gray-900">First Link</a>
            <a className="mr-5 hover:text-gray-900">Second Link</a>
            <a className="mr-5 hover:text-gray-900">Third Link</a>
            <a className="mr-5 hover:text-gray-900">Fourth Link</a>
            {meData ? (
              <>
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button>
                      <div className="button"> {meData.name}님 </div>
                    </Menu.Button>
                  </div>
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1 ">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            내 정보
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? "bg-gray-100 " : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <Image src={logout} width={20} height={20} />
                            <div className="ml-2">로그아웃</div>
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              </>
            ) : (
              <>
                {" "}
                <Link href="/login">
                  <button className="inline-flex items-center bg-gray-100 border-0 py-1.5 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    <Image src={logout} width={20} height={20} />
                    <Button className="ml-2" name="로그인" />
                  </button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};
