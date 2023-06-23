import UserProfilePage from "../../components/profile/user-profile";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import styles from "../../components/login/login-form.module.css";
import Head from "next/head";

const ProfilePage = () => {
  const oldPasswordInputRef = useRef();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const newPasswordInputRef = useRef();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const enteredOldPassword = oldPasswordInputRef.current.value;
    const enteredNewPassword = newPasswordInputRef.current.value;

    const response = await fetch("/api/users/change-password", {
      method: "PATCH",
      body: JSON.stringify({
        oldPassword: enteredOldPassword,
        newPassword: enteredNewPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Something went wrong.");
      setIsLoading(false);
      setSuccess(null);
      return;
    }
    console.log(data);

    oldPasswordInputRef.current.value = "";
    newPasswordInputRef.current.value = "";
    setIsLoading(false);
    setError(null);
    setSuccess("Password changed with sucess.");
  };
  return (
    <>
      <Head>
        <title>NextAuth Authentication</title>
        <meta name="description" content={`User Profile`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UserProfilePage email={session.user.email} />
      <div className={styles.container}>
        <h2>Change your password</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.form_control}>
            <label htmlFor="">Old password</label>
            <input type="password" ref={oldPasswordInputRef} />
          </div>
          <div className={styles.form_control}>
            <label htmlFor="">New password</label>
            <input type="password" ref={newPasswordInputRef} />
          </div>
          <div>
            <p className="error">{error}</p>
            <p className="success">{success}</p>
            <button
              className={`${styles.submit} ${styles.submit_margin}`}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session: JSON.parse(JSON.stringify(session)) },
  };
}

export default ProfilePage;
