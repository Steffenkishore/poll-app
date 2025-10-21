import React, { useState } from "react";
import Cookies from "js-cookie";
import { FaUserAlt, FaUnlockAlt } from "react-icons/fa";
import { LoginFormStyle } from "./styledComponents";
import { Link, Navigate } from "react-router-dom";
import './index.css'

const LoginForm = () => {
  const [loginUserDetail, setLoginUserDetail] = useState({
    userName: "",
    password: "",
  });
  const [loginStatus, setLoginStatus] = useState({
    status: "INITIAL",
    msg: null,
  });

  const submitLoginDetails = async (e) => {
    e.preventDefault();
    const { userName, password } = loginUserDetail;
    if (userName === "" || password === "") {
      return alert("All fields are required!!");
    } else if (password.length < 8) {
      return alert("Password must be atleast 8 characters!!");
    } else {
      console.log(loginUserDetail);
      try {
        const apiUrl = "https://poll-app-backend-h0jw.onrender.com/login";
        const option = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginUserDetail),
        };
        const response = await fetch(apiUrl, option);
        const data = await response.json();
        if (response.ok) {
          console.log(data);
          Cookies.set("jwt_token", data.jwtToken, {
            expires: 1,
          });
          setLoginStatus({ status: "SUCCESS", msg: "Successful Login" });
          setLoginUserDetail({
            userName: "",
            password: "",
          });
        } else {
          console.log(data);
          setLoginStatus({ status: "FAILED", msg: data.msg });
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const renderFinal = () => {
    const jwtToken = Cookies.get("jwt_token");
    if (jwtToken === undefined) {
      return (
        <div className="login-bg-con-2">
          <div className="welcome-container border-style">
            <div className="sub-welcome-con">
              <h1 className="welcome-heading">
                Lets Jump Back In ! <br/> Your Polls Missed You
              </h1>
              <p>
                Create, vote, and engage with your community in real thim.lets
                shape opinions together and see what the world think
              </p>
            </div>
          </div>
          <LoginFormStyle onSubmit={(e) => submitLoginDetails(e)}>
            <h1 className="signin-heading">Sign in</h1>
            <div className="username-input">
              <FaUserAlt className="username-icon" />;
              <input
                type="text"
                className="username-input-box"
                placeholder="Username"
                value={loginUserDetail.userName}
                onChange={(e) =>
                  setLoginUserDetail((prev) => ({
                    ...prev,
                    userName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="username-input">
              <FaUnlockAlt className="username-icon" />;
              <input
                type="password"
                placeholder="password"
                className="username-input-box"
                value={loginUserDetail.password}
                onChange={(e) =>
                  setLoginUserDetail((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            {loginStatus.status === "FAILED" ? <p className="signup-error-msg">{`*${loginStatus.msg}`}</p> : null}
            <p>
              Don't have an account ?
              <Link to="/signup" className="signup-link">
                Sign up
              </Link>
            </p>
          </LoginFormStyle>
        </div>
      );
    } else {
      return <Navigate to="/" />;
    }
  };

  return <div className="login-bg-con">{renderFinal()}</div>;
};

export default LoginForm;
