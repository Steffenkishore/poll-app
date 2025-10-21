import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
// import greenTick from "../assets/green-tick.png";
import { MdDoneOutline } from "react-icons/md";

import "./index.css";
import { Link } from "react-router-dom";

const Signup = () => {
  const [signUpDetails, setSignUpDetails] = useState({
    fullName: "",
    dob: "",
    gender: "",
    userName: "",
    email: "",
    password: "",
  });
  const [submitStatus, setSubmitStatus] = useState({
    status: "INITIAL",
    responseMsg: null,
  });

  const signUpForm = async (e) => {
    e.preventDefault();
    const { fullName, dob, gender, userName, email, password } = signUpDetails;
    if (
      fullName === "" ||
      dob === "" ||
      gender === "" ||
      userName === "" ||
      email === "" ||
      password === ""
    ) {
      return alert("All fields are required!");
    } else if (password.length < 8) {
      return alert("Password must be greater than 8 characters");
    }

    try {
      const postData = { ...signUpDetails, userId: uuidv4() };
      console.log(postData);
      const apiUrl = "http://localhost:3000/sign-up";
      const option = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      };
      const response = await fetch(apiUrl, option);
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setSubmitStatus({ status: "SUCCESS", responseMsg: data.msg });
      } else {
        setSubmitStatus({ status: "FAILED", responseMsg: data.msg });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={ submitStatus.status === "SUCCESS" ? 'signup-background-container-success' : 'signup-background-container' }>
      {submitStatus.status === "SUCCESS" ? (
        <div className="success-signup-container">
          <div className="success-signup-container-2">
            <div className="green-tick-con">
              <MdDoneOutline />
            </div>
            <h1 className="signup-success-heading">
              You're In! Let the Poll Power Begin.
            </h1>
            <p className="signup-success-para">
              let's start creating polls, gathering insights, and making your
              voice impossible to ignore.
            </p>

            <Link to="/login">
              <button type="button" className="back-to-login-btn">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="signup-bg-con">
          <form className="sign-up-form" onSubmit={(e) => signUpForm(e)}>
            <h1 className="signup-heading">Sign up</h1>
            <div className="signup-input-con">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                className="signup-input-boxes"
                id="fullName"
                placeholder="full name"
                value={signUpDetails.fullName}
                onChange={(e) =>
                  setSignUpDetails((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="signup-input-con">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                className="signup-input-boxes"
                id="dob"
                value={signUpDetails.dob}
                onChange={(e) =>
                  setSignUpDetails((prev) => ({ ...prev, dob: e.target.value }))
                }
              />
            </div>
            <div className="gender-box">
              <label htmlFor="male" className="gender-label">
                <input
                  type="radio"
                  className="radio-style"
                  id="male"
                  name="gender"
                  value="MALE"
                  checked={signUpDetails.gender === "MALE"}
                  onChange={(e) =>
                    setSignUpDetails((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                />
                Male
              </label>
              <label htmlFor="female" className="gender-label">
                <input
                  type="radio"
                  id="female"
                  className="radio-style"
                  name="gender"
                  value="FEMALE"
                  checked={signUpDetails.gender === "FEMALE"}
                  onChange={(e) =>
                    setSignUpDetails((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                />
                Female
              </label>
              <label htmlFor="others" className="gender-label">
                <input
                  type="radio"
                  className="radio-style"
                  id="others"
                  name="gender"
                  value="OTHERS"
                  checked={signUpDetails.gender === "OTHERS"}
                  onChange={(e) =>
                    setSignUpDetails((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                />
                Others
              </label>
            </div>
            <div className="signup-input-con">
              <label htmlFor="userName">User name</label>
              <input
                type="text"
                className="signup-input-boxes"
                id="userName"
                value={signUpDetails.userName}
                placeholder="username"
                onChange={(e) =>
                  setSignUpDetails((prev) => ({
                    ...prev,
                    userName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="signup-input-con">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                placeholder="email"
                className="signup-input-boxes"
                id="email"
                value={signUpDetails.email}
                onChange={(e) =>
                  setSignUpDetails((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <div className="signup-input-con">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                placeholder="password"
                className="signup-input-boxes"
                id="password"
                autoComplete="new-password"
                value={signUpDetails.password}
                onChange={(e) =>
                  setSignUpDetails((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            </div>
            <button type="submit" className="signup-button">
              Sign up
            </button>
            {submitStatus.status === "FAILED" ? (
              <p className="signup-error-msg">{`*${submitStatus.responseMsg}`}</p>
            ) : null}
            <p>
              Have an account ?
              <Link to="/login" className="signup-link">
                Log in
              </Link>
            </p>
          </form>
          <div className="welcome-con-signup">
            <div className="sub-welcome-con">
              <h1 className="welcome-heading">Welcome to Live Polls!</h1>
              <p>
                Tired of scrolling? Start shaping the story. Create viral polls,
                spark real-time reactions, and turn every opinion into impact.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
