import React from "react";

interface IFormErrorProp {
  errorMessage: string;
}

export const FormError: React.FC<IFormErrorProp> = ({ errorMessage }) => (
  <span className=" font-bold text-red-500  text-sm">{errorMessage}</span>
);
