import { useEffect, useState } from "react";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setUserInfo({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        marginTop: "20px",
        textAlign: "center",
        borderRadius: "10px",
        backgroundColor: "whitesmoke",
        color: "black",
        fontSize: "30px",
      }}
    >
      <h2>Profile</h2>
      <p>
        <strong>Name:</strong> {userInfo.name}
      </p>
      <p>
        <strong>Email:</strong> {userInfo.email}
      </p>
    </div>
  );
};

export default Profile;
