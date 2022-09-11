import React from "react";

interface IButtonProp {
  name: string;
  className?: string;
}

export const Button: React.FC<IButtonProp> = ({ name, className }) => (
  <a className="relative inline-block  font-medium  group  focus:outline-none focus:ring">
    <span className="absolute inset-0 transition-transform translate-x-0 translate-y-0 bg-gray-600 group-hover:translate-y-0.5 group-hover:translate-x-0.5"></span>

    <span
      className={`relative block px-5 py-2 bg-white border border-current ${className}`}
    >
      {name}
    </span>
  </a>
);
