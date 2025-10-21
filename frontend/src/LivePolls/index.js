import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Navbar from "../Navbar";
import "./index.css";

const LivePolls = () => {
  const [samples, setSamples] = useState([]);
  const [selected, setSelected] = useState([]);
  const [errorId, setErrorId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [optionTypeFilter, setOptionTypeFilter] = useState(""); // NEW STATE

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
    "Others",
  ];

  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      setFetchError(null);
      const jwtToken = Cookies.get("jwt_token");
      if (!jwtToken) {
        setFetchError("Authentication token missing.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("https://poll-app-backend-h0jw.onrender.com/get-polls", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${jwtToken}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setSamples(data);
        } else {
          setFetchError(data.message || "Failed to load polls.");
        }
      } catch (err) {
        setFetchError("Network error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  const submitForm = async (e, questionId, optionStyle) => {
    e.preventDefault();
    const jwtToken = Cookies.get("jwt_token");
    if (!jwtToken) {
      alert("Authentication required to vote.");
      return;
    }

    const postedPoll = selected.filter(
      (each) => each.questionId === questionId && each.answer.length !== 0
    );

    const hasMultipleAnswers = postedPoll[0]?.answer.length > 1;
    const isAnswered = postedPoll.length !== 0;
    const isSingle = optionStyle === "SINGLE";

    let errMsg = null;
    let submitStatus = true;

    if (!isAnswered) {
      errMsg = "Please select an option";
      submitStatus = false;
    } else if (hasMultipleAnswers && isSingle) {
      errMsg = "You cannot select more than one option";
      submitStatus = false;
    } else {
      if (postedPoll.length !== 0) {
        const selectedAnswers = postedPoll[0].answer.map(
          (each) => each.answerId
        );
        const postDetails = {
          questionId: postedPoll[0].questionId,
          selectedOptionId: selectedAnswers,
          votedAt: new Date(),
        };
        try {
          const apiUrlForPost = "https://poll-app-backend-h0jw.onrender.com/answered-polls";
          const response = await fetch(apiUrlForPost, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(postDetails),
          });
          if (!response.ok) {
            const data = await response.json();
            errMsg = data.message || "Failed to submit vote.";
            submitStatus = false;
          } else {
            // Optionally reload polls after vote or disable poll voting
            setSelected((prev) =>
              prev.filter((item) => item.questionId !== questionId)
            );
          }
        } catch (err) {
          errMsg = "Network error while submitting vote.";
          submitStatus = false;
        }
      }
    }

    const updatedErrorList = errorId.filter((e) => e.questionId !== questionId);
    setErrorId([
      ...updatedErrorList,
      {
        questionId,
        errMsg,
        submitStatus,
      },
    ]);
  };

  const changeSelected = (
    question,
    questionId,
    answerId,
    value,
    optionStyle
  ) => {
    const newAnswer = { answerId, value };
    setSelected((prev) => {
      const existing = prev.find((item) => item.questionId === questionId);

      if (existing) {
        return prev.map((item) => {
          if (item.questionId !== questionId) return item;

          const alreadySelected = item.answer.some(
            (ans) => ans.answerId === newAnswer.answerId
          );

          if (alreadySelected) {
            // Deselect it
            const filtered = item.answer.filter(
              (ans) => ans.answerId !== newAnswer.answerId
            );
            return { ...item, answer: filtered };
          } else {
            // For SINGLE option, ensure only one is selected
            if (optionStyle === "SINGLE" && item.answer.length >= 1) {
              setErrorId((prevErrors) => [
                ...prevErrors.filter((e) => e.questionId !== questionId),
                {
                  questionId,
                  errMsg: "You cannot select more than one option",
                },
              ]);
              return { ...item, answer: [...item.answer] };
            }
            return { ...item, answer: [...item.answer, newAnswer] };
          }
        });
      }

      // New question entry
      return [...prev, { question, questionId, answer: [newAnswer] }];
    });
    // Clear error for this question on selection change
    setErrorId((prevErrors) =>
      prevErrors.filter((e) => e.questionId !== questionId)
    );
  };



  // --- FILTERED SAMPLES LOGIC ---
  const filteredSamples = samples.filter((poll) => {
    const matchesSearch = poll.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter
      ? poll.category === categoryFilter
      : true;
    const matchesOptionType = optionTypeFilter
      ? poll.optionType === optionTypeFilter
      : true;
    return matchesSearch && matchesCategory && matchesOptionType;
  });

  // CLEAR FILTERS HANDLER
  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setOptionTypeFilter("");
  };

  // --- UI ---
  return (
    <div>
      <Navbar />
      <div className="livepoll-main-bg">
        <div className="filter-section-bg">
          {/* Search input */}
          <input
            type="search"
            placeholder="Search polls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search polls"
          />
          <h3>Filters</h3>
          {/* CATEGORY FILTER - FROM availableCategory */}
          <div style={{ marginBottom: 16 }}>
            <p>Category</p>
            <select
              aria-label="Filter by category"
              className="category-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {availableCategory.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* OPTION TYPE FILTER */}
          <div style={{ marginBottom: 16 }}>
            <p>Option Type</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label>
                <input
                  type="radio"
                  name="optionTypeFilter"
                  value=""
                  checked={optionTypeFilter === ""}
                  onChange={() => setOptionTypeFilter("")}
                />
                All
              </label>
              <label>
                <input
                  type="radio"
                  name="optionTypeFilter"
                  value="SINGLE"
                  checked={optionTypeFilter === "SINGLE"}
                  onChange={() => setOptionTypeFilter("SINGLE")}
                />
                Single
              </label>
              <label>
                <input
                  type="radio"
                  name="optionTypeFilter"
                  value="MULTIPLE"
                  checked={optionTypeFilter === "MULTIPLE"}
                  onChange={() => setOptionTypeFilter("MULTIPLE")}
                />
                Multiple
              </label>
            </div>
          </div>
          {/* CLEAR FILTER BUTTON */}
          <button
            className="clear-filter-btn"
            style={{ marginTop: 8 }}
            onClick={clearFilters}
            type="button"
          >
            Clear Filters
          </button>
        </div>
        {/* ...rest of your main-content-bg/poll rendering stays unchanged... */}
        <div className="main-content-bg">
          {loading && <p className="info-msg">Loading polls...</p>}
          {fetchError && <p className="error-msg">{fetchError}</p>}
          {!loading && filteredSamples.length === 0 && (
            <p className="info-msg">No polls match your criteria.</p>
          )}
          {filteredSamples.map((sample) => {
            const filteredError = errorId.find(
              (error) => error.questionId === sample.questionId
            );
            const hasVoted =
              filteredError &&
              filteredError.submitStatus &&
              !filteredError.errMsg;

            return (
              <form
                key={sample.questionId}
                className="live-poll-form"
                onSubmit={(e) =>
                  submitForm(e, sample.questionId, sample.optionType)
                }
              >
                {/* ...existing poll rendering logic... */}
                <div>
                  <p className="qns-heading">{sample.question}</p>
                  <div className="qns-info-box">
                    <p className="qns-category">Category: {sample.category}</p>
                    <p>Option Type: {sample.optionType}</p>
                    <p>
                      Created At:{" "}
                      {new Date(sample.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="option-container">
                    {sample.options.map((option) => (
                      <button
                        type="button"
                        key={option.id}
                        className={
                          selected
                            .find((item) => item.questionId === sample.questionId)
                            ?.answer.some((ans) => ans.answerId === option.id)
                            ? "selected option-style"
                            : "not-selected option-style"
                        }
                        onClick={() =>
                          !hasVoted &&
                          changeSelected(
                            sample.question,
                            sample.questionId,
                            option.id,
                            option.value,
                            sample.optionType
                          )
                        }
                        disabled={hasVoted}
                        aria-pressed={
                          selected
                            .find((item) => item.questionId === sample.questionId)
                            ?.answer.some((ans) => ans.answerId === option.id)
                            ? "true"
                            : "false"
                        }
                      >
                        {option.value}
                      </button>
                    ))}
                  </div>
                  {filteredError &&
                    filteredError.errMsg &&
                    !filteredError.submitStatus && (
                      <p className="error-msg">{filteredError.errMsg}</p>
                    )}
                  {hasVoted && (
                    <p className="info-msg voted-msg">
                      Your vote has been submitted.
                    </p>
                  )}
                </div>
                <div className="poll-buttons-row">
                  <button
                    type="submit"
                    className="post-button"
                    disabled={hasVoted}
                    aria-disabled={hasVoted}
                  >
                    {hasVoted ? "Voted" : "Post Vote"}
                  </button>
                </div>
              </form>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LivePolls;
