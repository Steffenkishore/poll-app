import React, { useEffect, useRef, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useParams, useNavigate } from "react-router-dom";
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

const MyPollDetail = () => {
  const { qnsid } = useParams();
  const navigate = useNavigate();

  const [outputData, setOutputData] = useState({
    status: "INITIAL",
    data: null,
  });
  const hasFetched = useRef(false);

  useEffect(() => {
    const apiFetch = async () => {
      hasFetched.current = true;
      const jwtToken = Cookies.get("jwt_token");
      try {
        const apiUrl = `http://localhost:3000/my-polls/poll/${qnsid}`;
        const option = {
          method: "GET",
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        };
        const response = await fetch(apiUrl, option);
        const data = await response.json();
        if (response.ok) {
          setOutputData({ status: "SUCCESS", data });
        } else {
          setOutputData({ status: "FAILED", data: null });
        }
      } catch (error) {
        console.log(error);
        setOutputData({ status: "FAILED", data: null });
      }
    };
    if (!hasFetched.current) {
      apiFetch();
    }
  }, [qnsid]);

  const renderSuccess = () => {
    const { questionDetails, results } = outputData.data;
    const { category, createdAt, optionType, options, question } =
      questionDetails;

    const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);

    // Prepare chart data
    const labels = options.map((o) => o.value);
    const votes = options.map((o) => {
      const found = results.find((r) => r.optionId === o.id);
      return found ? found.votes : 0;
    });

    const pieData = {
      labels,
      datasets: [
        {
          data: votes,
          backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4caf50"],
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
      <div className="poll-detail-container">
        <button
          className="back-button"
          onClick={() => navigate("/my-polls")}
          aria-label="Back to My Polls"
        >
          ← Back to My Polls
        </button>

        {/* Poll Header */}
        <div className="poll-header-card">
          <h1 className="poll-question">{question}</h1>
          <div className="poll-meta">
            <span>Category: {category}</span>
            <span>Type: {optionType}</span>
            <span>Created: {new Date(createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Results Section */}
        <div className="poll-results-section">
          <h2>Results</h2>
          {options?.map((each) => {
            const optionData = results.find((r) => r.optionId === each.id);
            const votesCount = optionData ? optionData.votes : 0;
            const percentage =
              totalVotes > 0 ? Math.round((votesCount / totalVotes) * 100) : 0;

            return (
              <div className="poll-option-card" key={each.id}>
                <div className="option-top">
                  <p className="option-text">{each.value}</p>
                  <p className="option-votes">
                    {votesCount} votes ({percentage}%)
                  </p>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}

          {/* Charts */}
          <div className="chart-wrapper" style={{ marginTop: "2rem" }}>
            <div className="chart-item">
              <Pie data={pieData} width={300} height={300} />
            </div>
            <div className="chart-item">
              <Bar data={barData} width={300} height={300} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLoading = () => (
    <div className="poll-loading">
      <TailSpin color="#00BFFF" height={60} width={60} />
    </div>
  );

  const renderFailure = () => (
    <div className="poll-failure">
      <h1>Failed to load poll details</h1>
    </div>
  );

  const renderSwitch = () => {
    switch (outputData.status) {
      case "SUCCESS":
        return renderSuccess();
      case "INITIAL":
        return renderLoading();
      case "FAILED":
        return renderFailure();
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar />
      {renderSwitch()}
    </div>
  );
};

export default MyPollDetail;
