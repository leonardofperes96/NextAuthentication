import NavigationHeader from "../components/navigation/main-navigation";
import "../styles/globals.css";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <Head>
          <title>NextAuth Authentication</title>
          <meta name="description" content={`Authentication with NextAuth`} />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavigationHeader />
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}

export default MyApp;
