import React from "react";
import { Header } from "./header";

interface ILayoutProp {
  children: any;
}

export const Layout: React.FC<ILayoutProp> = ({ children }) => {
  return (
    <>
      <Header />
      <div>{children}</div>
    </>
  );
};
