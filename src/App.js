import { Route, Routes } from "react-router-dom";
import "./App.css";
import CreatePoll from "./CreatePoll";
import LivePolls from "./LivePolls";
import LoginForm from "./LoginForm";
import Signup from "./Signup";
import Home from "./Home";
import ProtectedRoute from "./ProtectedRoute";
import MyPolls from "./MyPolls";
import MyPollDetail from "./MyPollDetail";
import VotedPolls from "./VotedPolls";

function App() {
  return (
    <div className="bg-con">
      <Routes>
        <Route exact path="/login" element={<LoginForm />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route
          exact
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/create-poll"
          element={
            <ProtectedRoute>
              <CreatePoll />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/live-polls"
          element={
            <ProtectedRoute>
              <LivePolls />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/my-polls"
          element={
            <ProtectedRoute>
              <MyPolls />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/voted-polls"
          element={
            <ProtectedRoute>
              <VotedPolls />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/my-polls/poll/:qnsid"
          element={
            <ProtectedRoute>
              <MyPollDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
