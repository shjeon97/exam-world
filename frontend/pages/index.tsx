import Head from "next/head";
import { Layout } from "../components/layout";

export default function Home() {
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
