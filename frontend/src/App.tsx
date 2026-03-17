// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { LoginView } from "./pages/LoginView";
// import { PlayerSessionView } from "./pages/PlayerSessionView";
// import { ResultView } from "./pages/ResultView";
// import { AdminStartView } from "./pages/AdminStartView";
// import { AdminSessionView } from "./pages/AdminSessionView";
// import { AdminResultsView } from "./pages/AdminResultsView";
import MainView from "./pages/MainView";
import CreateSession from "./pages/CreateSession";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/*General routes */}
        <Route path="/MainView" element={<MainView />} />
        <Route path="/CreateSession" element={<CreateSession />} />
        {/* 

        {/* Redirect unknown paths to Main */}
        <Route path="*" element={<Navigate to="/MainView" replace />} />
      </Routes>
    </Router>
  );
};

export default App;