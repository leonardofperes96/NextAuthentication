import styles from "./user-profile.module.css";
const UserProfilePage = ({ email }) => {
  return (
    <div className={styles.container}>
      <h1>Welcome, {email ? email : ""}</h1>
    </div>
  );
};

export default UserProfilePage;
