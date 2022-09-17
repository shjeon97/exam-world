import Link from "next/link";
import React from "react";

interface ILinkCardProp {
  name: string;
  link: string;
}

export const LinkButton: React.FC<ILinkCardProp> = ({ name, link }) => (
  <Link href={link}>
    <div className="block h-auto group w-auto  hover:cursor-pointer ">
      <div className="relative  inset-0  transition bg-white border-2 border-black group-hover:-translate-x group-hover:-translate-y rounded group-hover:shadow-[2px_2px_0_0_#000] p-2 ">
        <div className="lg:group-hover:opacity-0 lg:group-hover:absolute">
          <span className=" text-gray-900 text-lg content-center justify-center font-semibold sm:text-lg">
            {name}
          </span>
        </div>
        <div className="absolute opacity-0 lg:group-hover:opacity-100 lg:group-hover:relative">
          <span className="text-gray-900 text-lg font-semibold"> {name}</span>
        </div>
      </div>
    </div>
  </Link>
);
