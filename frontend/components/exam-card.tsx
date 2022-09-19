import Link from "next/link";
import React from "react";

interface ILinkCardProp {
  userId: number;
  name: string;
  title?: string;
  id: number;
}

export const ExamCard: React.FC<ILinkCardProp> = ({ id, name, title }) => (
  <div className="p-1 shadow-xl border-2 border-gray-800 w-auto h-auto rounded">
    <div className="block p-6 bg-white sm:p-8 rounded">
      <h5 className="text-xl font-bold text-gray-900">{name}</h5>

      <p className="mt-2 text-sm text-gray-500">{title} </p>
    </div>
    <Link href={`/exam/${id}/info`}>
      <div className="button text-xs p-1 w-10">정보</div>
    </Link>
  </div>
);
