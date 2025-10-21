import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import Navbar from "../Navbar";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import "./index.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

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

const VotedPolls = () => {
  const [result, setResult] = useState({ status: "INITIAL", data: null });
  const initial = useRef(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [optionTypeFilter, setOptionTypeFilter] = useState("");

  useEffect(() => {
    const apiFetch = async () => {
      initial.current = true;
      const jwtToken = Cookies.get("jwt_token");
      const apiUrl = "https://poll-app-backend-h0jw.onrender.com/voted-polls";
      const option = {
        method: "GET",
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      };
      const response = await fetch(apiUrl, option);
      const data = await response.json();
      if (response.ok) {
        setResult({ status: "SUCCESS", data });
      } else {
        setResult({ status: "FAILED", data });
      }
    };
    if (!initial.current) {
      apiFetch();
    }
  }, []);

  // Filter questions based on search, category, and optionType
  const getFilteredQuestions = () => {
    if (!result.data || !result.data.questionDetails) return [];
    return result.data.questionDetails.filter((question) => {
      const matchesSearch = question.question
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter
        ? question.category === categoryFilter
        : true;
      const matchesOptionType = optionTypeFilter
        ? question.optionType === optionTypeFilter
        : true;
      return matchesSearch && matchesCategory && matchesOptionType;
    });
  };

  const renderFilterSection = () => (
    <aside className="filter-section-bg" aria-label="Poll filters">
      <input
        type="search"
        placeholder="Search polls..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search polls"
      />
      <h3>Filters</h3>

      <div className="filter-group">
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

      <div className="filter-group">
        <p>Option Type</p>
        <label>
          <input
            type="radio"
            name="optionType"
            value=""
            checked={optionTypeFilter === ""}
            onChange={() => setOptionTypeFilter("")}
          />{" "}
          All
        </label>
        <label>
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

      <button
        className="clear-filter-btn"
        type="button"
        onClick={() => {
          setSearchTerm("");
          setCategoryFilter("");
          setOptionTypeFilter("");
        }}
      >
        Clear Filters
      </button>
    </aside>
  );

  const renderSuccess = () => {
    const { allVotesDetail, votedDetails } = result.data;

    const filteredQuestions = getFilteredQuestions();

    if (filteredQuestions.length === 0) {
      return (
        <>
          {renderFilterSection()}
          <p className="info-msg no-polls-msg">
            There are no voted polls matching your filters.
          </p>
        </>
      );
    }

    const questionResults = filteredQuestions.map((question) => {
      const initializedOptions = question.options.map((option) => ({
        ...option,
        vote: 0,
      }));

      allVotesDetail.forEach((voteRecord) => {
        if (voteRecord.questionId === question.questionId) {
          voteRecord.selectedOptionId.forEach((selectedId) => {
            const optionToUpdate = initializedOptions.find(
              (opt) => opt.id === selectedId
            );
            if (optionToUpdate) {
              optionToUpdate.vote += 1;
            }
          });
        }
      });

      return {
        questionId: question.questionId,
        optionResult: initializedOptions,
      };
    });

    const userSelectedOptions = votedDetails.flatMap(
      (each) => each.selectedOptionId
    );

    return (
      <div className="content-wrapper">
        <section className="polls-container" aria-live="polite">
          {filteredQuestions.map((each) => {
            const filteredResult = questionResults.find(
              (eachResult) => eachResult.questionId === each.questionId
            );

            const labels = filteredResult.optionResult.map((opt) => opt.value);
            const votes = filteredResult.optionResult.map((opt) => opt.vote);

            const pieData = {
              labels,
              datasets: [
                {
                  data: votes,
                  backgroundColor: [
                    "#ff6384",
                    "#36a2eb",
                    "#ffce56",
                    "#4caf50",
                    "#ba68c8",
                    "#f06292",
                    "#4db6ac",
                  ],
                },
              ],
            };

            const barData = {
              labels,
              datasets: [
                {
                  label: "Votes",
                  data: votes,
                  backgroundColor: "#36a2eb",
                },
              ],
            };

            return (
              <div key={each.questionId} className="poll-card">
                <h2 className="poll-title">{each.question}</h2>
                <p className="poll-category">{each.category}</p>
                <div className="options-list">
                  {filteredResult.optionResult.map((eachOption) => (
                    <div
                      key={eachOption.id}
                      className={`option-item ${
                        userSelectedOptions.includes(eachOption.id)
                          ? "user-selected-option"
                          : ""
                      }`}
                      title={
                        userSelectedOptions.includes(eachOption.id)
                          ? "Your selected option"
                          : ""
                      }
                    >
                      <span>{eachOption.value}</span>
                      <span>{`Votes: ${eachOption.vote}`}</span>
                    </div>
                  ))}
                </div>

                <div className="chart-wrapper">
                  <div className="chart-item">
                    <Pie data={pieData} width={280} height={280} />
                  </div>
                  <div className="chart-item">
                    <Bar data={barData} width={280} height={280} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="main-con-bg">
        {renderFilterSection()}
        <main className="voted-poll-bg">
          {result.status === "SUCCESS" && renderSuccess()}
          {result.status === "FAILED" && (
            <p className="error-message">Failed to fetch data</p>
          )}
          {result.status === "INITIAL" && (
            <p className="loading-message">Loading voted polls...</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default VotedPolls;
