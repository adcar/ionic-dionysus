import React from "react";

interface IProps {
  children: any;
}

export default function HorizScroll({ children }: IProps) {
  return <div className="horiz">{children}</div>;
}
