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
    className={`w-full select-none font-medium focus:outline-none text-white py-2  transition-colors  ${
      canClick
        ? "dark:bg-gray-800 dark:hover:bg-gray-700 bg-yellow-600 hover:bg-yellow-700"
        : "bg-gray-400 pointer-events-none "
    }`}
  >
    {loading ? "Loading..." : actionText}
  </button>
);
