import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import "./index.css"; // Add styles here

const MyPolls = () => {
  const [myPolls, setMyPolls] = useState({
    status: "INITIAL",
    data: null,
  });
  const [deletePollingId, setDeletePollingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [optionTypeFilter, setOptionTypeFilter] = useState("");

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
    const jwtToken = Cookies.get("jwt_token");
    const getPolls = async () => {
      try {
        const apiUrl = "https://poll-app-backend-h0jw.onrender.com/my-polls";
        const option = {
          method: "GET",
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        };
        const response = await fetch(apiUrl, option);
        const data = await response.json();
        if (response.ok) {
          setMyPolls({
            status: "SUCCESS",
            data,
          });
        }
      } catch (e) {
        console.log(e);
      }
    };
    if (myPolls.status === "INITIAL") {
      getPolls();
    }
  }, []);

  const handleDeletePoll = async (pollId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this poll? This action cannot be undone."
      )
    ) {
      return;
    }
    setIsDeleting(true);
    setDeleteError(null);
    const jwtToken = Cookies.get("jwt_token");
    if (!jwtToken) {
      setDeleteError("Authentication required.");
      setIsDeleting(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/delete-poll/${pollId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMyPolls((prev) => ({
          ...prev,
          data: prev.data
            ? prev.data.filter((poll) => poll.questionId !== pollId)
            : [],
        }));
        setDeleteError(null);
      } else {
        setDeleteError(data.message || "Failed to delete poll.");
      }
    } catch {
      setDeleteError("Network error while deleting poll.");
    }
    setIsDeleting(false);
  };

  const filterSection = () => (
    <div className="filter-section-bg">
      <input
        type="search"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search polls"
      />
      <h3>Filters</h3>
      {/* CATEGORY FILTER */}
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
        <label style={{ marginRight: 8 }}>
          <input
            type="radio"
            name="optionType"
            value=""
            checked={optionTypeFilter === ""}
            onChange={() => setOptionTypeFilter("")}
          />{" "}
          All
        </label>
        <label style={{ marginRight: 8 }}>
          <input
            type="radio"
            name="optionType"
            value="SINGLE"
            checked={optionTypeFilter === "SINGLE"}
            onChange={() => setOptionTypeFilter("SINGLE")}
          />{" "}
          Single
        </label>
        <label>
          <input
            type="radio"
            name="optionType"
            value="MULTIPLE"
            checked={optionTypeFilter === "MULTIPLE"}
            onChange={() => setOptionTypeFilter("MULTIPLE")}
          />{" "}
          Multiple
        </label>
      </div>
      {/* CLEAR FILTER BUTTON */}
      <button
        className="clear-filter-btn"
        style={{ marginTop: 8 }}
        type="button"
        onClick={() => {
          setSearchTerm("");
          setCategoryFilter("");
          setOptionTypeFilter("");
        }}
      >
        Clear Filters
      </button>
    </div>
  );

  const filteredData =
    myPolls.data?.filter((poll) => {
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
    }) ?? [];

    console.log(myPolls)



  return (
    <div>
      <Navbar />
      <div className="mypolls-container">
        <div>{filterSection()}</div>
        <div>
          {filteredData.length === 0 ? (
            <h2 className="no-polls">No Polls Available</h2>
          ) : (
            <div className="mypolls-grid">
              {filteredData.map((each) => (
                <div key={each.questionId} className="mypoll-card">
                  <h3 className="mypoll-question">{each.question}</h3>
                  <p className="mypoll-meta">
                    Created: {new Date(each.createdAt).toLocaleDateString()}
                  </p>
                  <div className="link-con">
                    <Link to={`poll/${each.questionId}`} className="link-style">
                      <span className="mypoll-view-btn">View Details →</span>
                    </Link>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDeletePoll(each.questionId)}
                      disabled={isDeleting}
                      aria-disabled={isDeleting}
                    >
                      Delete Poll
                    </button>
                    {deleteError && <p className="error-msg">{deleteError}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPolls;
