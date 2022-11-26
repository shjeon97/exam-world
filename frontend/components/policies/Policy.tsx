import React from "react";

export const Policy: React.FC = () => {
  return (
    <>
      <h1 className="title-font sm:text-2xl text-xl mb-4 font-medium text-gray-900">
        개인정보 수집 및 이용동의
      </h1>
      <div className="border w-full border-gray-400 mb-4" />
      <div>
        해당 사이트는 회원가입, 서비스 제공 등에 따른 이메일, 닉네임 등
        개인정보를 수집하고 있으며, 그리고 보다 다양한 서비스 제공을 위하여
        아래와 같이 회원의 개인정보를 수집, 이용합니다.
      </div>
      <div className="flex flex-col  ">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8 ">
            <div className="overflow-hidden">
              <table className="min-w-full border text-center border-gray-400 ">
                <thead className="border-b border-gray-400">
                  <tr>
                    <th
                      scope="col"
                      style={{ minWidth: "100px" }}
                      className="lg:text-sm text-xs font-medium text-gray-900 px-6 py-4 border-r border-gray-400"
                    >
                      이용목적
                    </th>
                    <th
                      scope="col"
                      className="lg:text-sm text-xs font-medium text-gray-900 px-6 py-4 border-r border-gray-400"
                    >
                      수집항목
                    </th>
                    <th
                      scope="col"
                      className="lg:text-sm text-xs font-medium text-gray-900 px-6 py-4 border-gray-400"
                    >
                      보유기간
                    </th>
                  </tr>
                </thead>
                <tbody className="text-left">
                  <tr className="border-b border-gray-400">
                    <td className="px-6 py-4  lg:text-sm text-xs text-gray-900 border-r border-gray-400">
                      불량회원의 부정 이용 방지와 비인가 사용 방지, 불만처리 등
                      민원처리
                    </td>
                    <td className="lg:text-sm text-xs text-gray-900 px-6 py-4  border-r border-gray-400">
                      (필수)아이디, 비밀번호,닉네임,이메일,암호화된 이용자
                      확인값(CI)
                    </td>
                    <td
                      rowSpan={2}
                      className=" text-gray-900 lg:text-sm text-xs px-6 py-4  border-r border-gray-400 "
                    >
                      고객님의 개인정보는 서비스 제공 기간동안 보유 및 이용하며,
                      내부지침에 의해 부정이용 방지, 명예훼손 등 권리침해 분쟁
                      및 수사협조 목적으로 회원탈퇴 후 1년간 보관합니다. 또한
                      관계법령에 의해 보존할 경우 그 의무기간동안 보관합니다.
                    </td>
                  </tr>
                  <tr className=" border-b border-gray-400">
                    <td className="px-6 py-4  lg:text-sm text-xs text-gray-900 border-r border-gray-400">
                      소비자보호를 위한 법적의무준수, 서비스통계 분석 등
                    </td>
                    <td className=" text-gray-900 lg:text-sm text-xs px-6 py-4  border-r border-gray-400">
                      IP Address, 쿠키, 방문일자, 서비스 이용기록
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mb-2">
                서비스 제공을 위해서 필요한 최소한의 개인정보만을 수집 및
                이용하기에 동의를 해주셔야만 서비스를 이용하실 수 있습니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
