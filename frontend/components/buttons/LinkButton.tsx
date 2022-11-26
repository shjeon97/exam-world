import Link from "next/link";
import React from "react";

interface ILinkCardProp {
  name: any;
  link: string;
}

export const LinkButton: React.FC<ILinkCardProp> = ({ name, link }) => (
  <Link href={link}>
    <div className="block h-auto group w-auto  hover:cursor-pointer ">
      <div className="relative  inset-0  transition bg-white dark:bg-gray-200 border-2 border-black group-hover:-translate-x group-hover:-translate-y rounded group-hover:shadow-[2px_2px_0_0_#000] p-2 ">
        <span className="text-gray-900  font-semibold"> {name}</span>
      </div>
    </div>
  </Link>
);
