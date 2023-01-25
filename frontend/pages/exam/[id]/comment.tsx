import { Page, PageSize, WEB_TITLE } from "../../../constant";
import Head from "next/head";
import { useEffect, useState } from "react";
import { apiSearchExamComment } from "../../../api/axios";
import { useMutation } from "react-query";
import { IExamComment, IPaginationOutput } from "../../../common/type";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import { GetServerSideProps } from "next";
import { CreateExamCommentForm } from "../../../components/forms/exam/comment/CreateExamCommentForm";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const { id } = query;
  return {
    props: {
      id,
    },
  };
};

export default function ExamComment({ id }) {
  const [page, setPage] = useState<number>(Page);
  const [pageSize] = useState<number>(PageSize);
  const [sort, setSort] = useState<string>("like");
  const [comments, setComment] = useState<IExamComment[]>([]);

  const searchExamCommentMutation = useMutation(apiSearchExamComment, {
    onSuccess: async (data: IPaginationOutput) => {
      if (data && data.ok) {
        if (comments) {
          setComment([...comments, ...data.result]);
        } else {
          setComment(data.result);
        }
      }
    },
  });

  useEffect(() => {
    searchExamCommentMutation.mutate({
      id,
      page,
      "page-size": pageSize,
      sort: sort ? sort : null,
    });
  }, [page]);

  const infiniteScroll = useInfiniteScroll(
    !searchExamCommentMutation.isLoading
  );

  useEffect(() => {
    if (infiniteScroll) {
      setPage(page + 1);
    }
  }, [infiniteScroll]);
  console.log(comments);

  return (
    <div className=" min-h-screen">
      <Head>
        <title>댓글 {WEB_TITLE}</title>
      </Head>
      <div className="flex flex-col items-center justify-center  p-6 ">
        <div className="w-10/12 mx-auto md:w-5/12 md:max-w-3xl ">
          <CreateExamCommentForm examId={id} />
          {comments.length > 0 && (
            <div className="mt-10 p-2 border-2 rounded-md border-gray-500">
              {comments.map((comment) => {
                return <div className="">{comment.text}</div>;
              })}
            </div>
          )}
          <div className="button" onClick={() => setPage(page + 1)}>
            더보기
          </div>
        </div>
      </div>
    </div>
  );
}
