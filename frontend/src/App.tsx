// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
// import { LoginView } from "./pages/LoginView";
// import { PlayerSessionView } from "./pages/PlayerSessionView";
// import { ResultView } from "./pages/ResultView";
// import { AdminStartView } from "./pages/AdminStartView";
// import { AdminSessionView } from "./pages/AdminSessionView";
// import { AdminResultsView } from "./pages/AdminResultsView";
import MainView from "./pages/MainView";
import CreateSession from "./pages/CreateSession";
import JoinSession from "./pages/JoinSession";
import Questions from "./pages/Questions";

/** Old route name; forwards to Questions. */
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
        {/*General routes */}
        <Route path="/MainView" element={<MainView />} />
        <Route path="/CreateSession" element={<CreateSession />} />
        <Route path="/join-session" element={<JoinSession />} />
        <Route path="/session/:sessionId/questions" element={<Questions />} />
        <Route path="/session/:sessionId/play" element={<SessionPlayRedirect />} />
        {/* Redirect unknown paths to Main */}
        <Route path="*" element={<Navigate to="/MainView" replace />} />
      </Routes>
    </Router>
  );
};

export default App;