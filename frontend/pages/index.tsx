import Head from "next/head";
import Image from "next/image";
import { useQuery, useQueryClient } from "react-query";
import { apiMe } from "../common/api/axios";
import { Layout } from "../components/layout";

export default function Home() {
  const { isLoading: meIsLoading, data: meData } = useQuery("me", apiMe);

  if (meData) {
    console.log(meData);
  }

  return (
    <Layout>
      <div>
        <Head>
          <title className=" text-gray-600">Create Next App</title>
        </Head>
        <div>test</div>
      </div>
    </Layout>
  );
}
