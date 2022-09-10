import React from "react";

interface IFormButtonProp {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const FormButton: React.FC<IFormButtonProp> = ({
  canClick,
  loading,
  actionText,
}) => (
  <button
    className={`w-full select-none font-medium focus:outline-none text-white py-2  transition-colors rounded ${
      canClick
        ? "bg-gray-800 hover:bg-gray-700 "
        : "bg-gray-300 pointer-events-none "
    }`}
  >
    {loading ? "Loading..." : actionText}
  </button>
);
