const baseTitle = "Exam World!";
const user = cy;
describe("login", () => {
  beforeEach(() => {
    user.visit("/login");
  });
  it("로그인 페이지 이동", () => {
    user.title().should("eq", "로그인 " + baseTitle);
  });

  it("잘못된 email 또는 password로 User 로그인 시", () => {
    user.get(":nth-child(1) > .form-input").type("bad@email.com");
    user.get(":nth-child(2) > .form-input").type("badPassword");
    user.get(".w-full").click();
    user
      .get("form > .font-bold")
      .should(
        "have.text",
        "등록되지 않은 이메일이거나, 이메일 또는 비밀번호를 잘못 입력하셨습니다."
      );
    user.wait(1000);
  });

  it("User 로그인 성공", () => {
    user.get(":nth-child(1) > .form-input").type("test@test.com");
    user.get(":nth-child(2) > .form-input").type("test");
    user.get(".w-full").click();
  });
});

export {};
