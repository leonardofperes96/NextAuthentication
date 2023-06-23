import LoginForm from "../../components/login/login-form";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import Head from "next/head";

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>NextAuth Authentication</title>
        <meta name="description" content={`Login`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoginForm />
    </>
  );
};

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  console.log(session);

  if (!session) {
    return {
      props: {},
    };
  }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}

export default LoginPage;
