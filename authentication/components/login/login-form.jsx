import styles from "./login-form.module.css";
import { useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const LoginForm = () => {
  const [isRegistered, setIsRegistered] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    const userObj = {
      email: enteredEmail,
      password: enteredPassword,
    };

    if (isRegistered) {
      // do some login logic
      const result = await signIn("credentials", {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });

      if (!result.error) {
        router.replace("/profile");
      }
      setError(result.error);
      setIsLoading(false);
      return;
    } else {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(userObj),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong.");
        setIsLoading(false);
        return;
      }
    }

    emailInputRef.current.value = "";
    passwordInputRef.current.value = "";
    setIsLoading(false);
    setError(null);
  };

  const toggleState = () => {
    emailInputRef.current.value = "";
    passwordInputRef.current.value = "";
    setIsLoading(false);
    setError(null);
    setIsRegistered(!isRegistered);
  };

  return (
    <div className={styles.container}>
      <h1>{isRegistered ? "Login" : "Sign Up"}</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.form_control}>
          <label htmlFor="">Email</label>
          <input type="email" ref={emailInputRef} />
        </div>
        <div className={styles.form_control}>
          <label htmlFor="">Password</label>
          <input type="password" ref={passwordInputRef} />
        </div>
        <div>
          <p className="error">{error}</p>
        </div>
        <div className={styles.form_actions}>
          <button disabled={isLoading} className={styles.submit}>
            {isRegistered && !isLoading && "Login"}
            {!isRegistered && !isLoading && "Create Account"}
            {isRegistered && isLoading && "Loading..."}
            {!isRegistered && isLoading && "Loading..."}
          </button>
          <button type="button" onClick={toggleState} className={styles.toggle}>
            {isRegistered
              ? "Create a new account"
              : "Login with existing account"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
