import { useRouter } from "next/router";

export default function ExamInfo() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <div>test - {id}</div>
    </>
  );
}
