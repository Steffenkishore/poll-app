import React, { useEffect, useReducer, useRef } from "react";
import { ThreeDots } from "react-loader-spinner";
import { v4 as uuidv4 } from "uuid";
import Cookie from "js-cookie";
import { MdDeleteForever } from "react-icons/md";
import Navbar from "../Navbar";
import SuccessTick from "../assets/green-tick.png"
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

const pollStatusWords = {
  success: "SUCCESS",
  failed: "FAILED",
  loading: "LOADING",
  initial: "INITIAL",
};

const availableCategory = [
  "Food and Drink",
  "Entertainment",
  "Technology and Gadgets",
  "Lifestyle and Fashion",
  "Education",
  "Health and Fitness",
  "Politics and Society",
  "Travel and Places",
  "Business and Finance",
  "Science and Innovation",
  "Personal Preferences",
  "Events and Festivals",
  "Others"
];

const initialStates = {
  category: "",
  questions: "",
  optionType: "",
  options: [
    { id: uuidv4(), value: "" },
    { id: uuidv4(), value: "" },
  ],
  poll: null,
  triggerSubmit: false,
  pollStatus: { status: pollStatusWords.initial, msg: null },
  error: "",
};


function reducer(state, action) {
  switch (action.type) {
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "SET_QUESTION":
      return { ...state, questions: action.payload };
    case "SET_OPTION":
      return {
        ...state,
        options: state.options.map((opt) =>
          opt.id === action.payload.id
            ? { ...opt, value: action.payload.value }
            : opt
        ),
      };
    case "ADD_OPTIONS":
      // const {options} = state;
      // if (options.length >= 6) {
      //   alert("You can't add more than 6 options!!")
      //   return {
      //     ...state
      //   };
      // }
      return {
        ...state,
        options: [...state.options, { id: uuidv4(), value: "" }],
      };
    case "DELETE_OPTION":
      if (state.options.length <= 2) return state;
      return {
        ...state,
        options: state.options.filter((opt) => opt.id !== action.payload),
      };
    case "SET_OPTION_TYPE":
      return { ...state, optionType: action.payload };
    case "TRIGGER_SUBMIT":
      action.payload.preventDefault();
      const pollData = {
        questionId: uuidv4(),
        category: state.category,
        question: state.questions,
        optionType: state.optionType,
        options: state.options,
        createdAt: new Date(),
      };
      return { ...state, poll: pollData, triggerSubmit: true, error: "" };
    case "SET_STATUS_LOADING":
      return {
        ...state,
        pollStatus: { status: pollStatusWords.loading, msg: "Loading..." },
      };
    case "SET_STATUS_SUCCESS":
      return {
        ...initialStates,
        pollStatus: { status: pollStatusWords.success, msg: action.payload },
      };
    case "SET_STATUS_FAILURE":
      return {
        ...state,
        pollStatus: { status: pollStatusWords.failed, msg: action.payload },
        triggerSubmit: false,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const checkSubmit = (state, dispatch, e) => {
  const optionValues = state.options.filter((each) => each.value !== "");
  if (!state.category || !state.questions || !state.optionType) {
    dispatch({ type: "SET_ERROR", payload: "All fields are required" });
    return;
  } else if (optionValues.length < 2) {
    dispatch({ type: "SET_ERROR", payload: "At least 2 options are required" });
    return;
  } else {
    dispatch({ type: "SET_ERROR", payload: "" });
    dispatch({ type: "TRIGGER_SUBMIT", payload: e });
  }
};

const handleAddOption = (state, dispatch) => {
  if (state.options.length >= 6) {
    alert("You can't add more than 6 options!!");
    return;
  }
  dispatch({ type: "ADD_OPTIONS" });
};

const CreatePoll = () => {
  const [state, dispatch] = useReducer(reducer, initialStates);
  const navigate = useNavigate();

  useEffect(() => {
    const apiFetch = async () => {
      dispatch({ type: "SET_STATUS_LOADING" });
      try {
        const jwtToken = Cookie.get("jwt_token");
        if (!jwtToken)
          return dispatch({
            type: "SET_STATUS_FAILURE",
            payload: "Authentication required.",
          });
        const res = await fetch("http://localhost:3000/add-poll", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(state.poll),
        });
        const data = await res.json();
        if (res.ok) {
          dispatch({
            type: "SET_STATUS_SUCCESS",
            payload: data.message || "Poll Created!",
          });
        } else {
          dispatch({
            type: "SET_STATUS_FAILURE",
            payload: data.message || "Failed!",
          });
        }
      } catch {
        dispatch({ type: "SET_STATUS_FAILURE", payload: "Network error" });
      }
    };
    if (state.triggerSubmit && state.poll) {
      apiFetch();
    }
  }, [state.poll, state.triggerSubmit]);

  const renderForm = () => (
    <div className="poll-bg">
      <form
        className="poll-card"
        onSubmit={(e) => {
          e.preventDefault();
          checkSubmit(state, dispatch, e);
        }}
        autoComplete="off"
      >
        <h1 className="poll-heading">Create a New Poll</h1>
        <div className="poll-field-group">
          <label htmlFor="category" className="poll-label">
            Category
          </label>
          <select
            id="category"
            className="poll-input"
            value={state.category}
            onChange={(e) =>
              dispatch({ type: "SET_CATEGORY", payload: e.target.value })
            }
            aria-label="Poll category"
          >
            <option value="" disabled>
              Select a category
            </option>
            {availableCategory.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="poll-field-group">
          <label htmlFor="question" className="poll-label">
            Question
          </label>
          <input
            aria-label="Poll question"
            id="question"
            className="poll-input"
            value={state.questions}
            onChange={(e) =>
              dispatch({ type: "SET_QUESTION", payload: e.target.value })
            }
            placeholder="e.g., What is your favorite programming language?"
          />
        </div>
        <div className="poll-field-group">
          <span className="poll-label">Option Type</span>
          <div className="option-type-group">
            <label>
              <input
                type="radio"
                name="optionType"
                value="SINGLE"
                checked={state.optionType === "SINGLE"}
                onChange={() =>
                  dispatch({ type: "SET_OPTION_TYPE", payload: "SINGLE" })
                }
              />
              Single
            </label>
            <label>
              <input
                type="radio"
                name="optionType"
                value="MULTIPLE"
                checked={state.optionType === "MULTIPLE"}
                onChange={() =>
                  dispatch({ type: "SET_OPTION_TYPE", payload: "MULTIPLE" })
                }
              />
              Multiple
            </label>
          </div>
        </div>
        <div className="poll-field-group">
          <label className="poll-label">Options</label>
          <div className="poll-options-list">
            {state.options.map((opt) => (
              <div key={opt.id} className="poll-option">
                <input
                  type="text"
                  value={opt.value}
                  className="poll-input"
                  onChange={(e) =>
                    dispatch({
                      type: "SET_OPTION",
                      payload: { id: opt.id, value: e.target.value },
                    })
                  }
                  placeholder="Poll option"
                />
                <button
                  type="button"
                  className="option-del-btn"
                  tabIndex={0}
                  aria-label="Remove option"
                  disabled={state.options.length <= 2}
                  onClick={() =>
                    dispatch({ type: "DELETE_OPTION", payload: opt.id })
                  }
                >
                  <MdDeleteForever />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="add-option-btn"
            onClick={() => handleAddOption(state,dispatch)}
          >
            + Add Option
          </button>
        </div>
        {state.error && (
          <div className="poll-error" role="alert">
            {state.error}
          </div>
        )}
        <button className="poll-submit-btn" type="submit">
          {state.pollStatus.status === pollStatusWords.loading
            ? "Creating..."
            : "Create Poll"}
        </button>
      </form>
    </div>
  );

  const renderLoading = () => (
    <div className="poll-loader">
      <ThreeDots height="80" width="80" color="#00BFFF" visible={true} />
    </div>
  );
  const renderSuccess = () => (
    <div className="poll-success-bg">
      <div className="poll-success-card">
        <img
          src={SuccessTick}
          alt="Poll posted!"
          className="poll-success-img"
        />
        <h1 className="poll-success-heading">Poll Posted!</h1>
        <p className="poll-success-msg">
          Your poll is live and visible in available polls.
        </p>
        <div className="poll-success-actions">
          <button
            className="poll-success-btn"
            onClick={() => window.location.reload()}
          >
            Create Another
          </button>
          <button
            className="poll-success-btn"
            onClick={() => navigate("/live-polls")}
          >
            See Live Polls
          </button>
        </div>
      </div>
    </div>
  );
  const renderFailure = () => (
    <div className="poll-failure">
      <h2 className="poll-error">{state.pollStatus.msg}</h2>
      <button
        className="poll-retry-btn"
        onClick={() =>
          dispatch({
            type: "TRIGGER_SUBMIT",
            payload: { preventDefault: () => {} },
          })
        }
      >
        Retry
      </button>
    </div>
  );

  let renderContent;
  switch (state.pollStatus.status) {
    case pollStatusWords.loading:
      renderContent = renderLoading();
      break;
    case pollStatusWords.success:
      renderContent = renderSuccess();
      break;
    case pollStatusWords.failed:
      renderContent = renderFailure();
      break;
    default:
      renderContent = renderForm();
  }

  return (
    <div>
      <Navbar />
      {renderContent}
    </div>
  );
};

export default CreatePoll;
