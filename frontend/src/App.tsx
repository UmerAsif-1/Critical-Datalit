import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import MainView from "./pages/MainView";
import CreateSession from "./pages/CreateSession";
import AdminView from "./pages/AdminView";
import AdminSessionEnded from "./pages/AdminSessionEnded";
import JoinSession from "./pages/JoinSession";
import Questions from "./pages/Questions";
import UserResults from "./pages/UserResults";

const SessionPlayRedirect: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  return (
    <Navigate to={`/session/${sessionId}/questions`} replace />
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/MainView" element={<MainView />} />
        <Route path="/CreateSession" element={<CreateSession />} />
        <Route path="/admin/:sessionId/ended" element={<AdminSessionEnded />} />
        <Route path="/admin/:sessionId" element={<AdminView />} />
        <Route path="/join-session" element={<JoinSession />} />
        <Route path="/session/:sessionId/questions" element={<Questions />} />
        <Route path="/session/:sessionId/results" element={<UserResults />} />
        <Route path="/session/:sessionId/play" element={<SessionPlayRedirect />} />
        <Route path="*" element={<Navigate to="/MainView" replace />} />
      </Routes>
    </Router>
  );
};

export default App;