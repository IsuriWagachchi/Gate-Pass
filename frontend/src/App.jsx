import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import NewRequest from "./pages/NewRequest";
import MyRequest from "./pages/MyRequest";
import UpdateRequest from './pages/UpdateRequest';
//import ViewRequest from './pages/ViewRequest';
import ItemTracker from "./pages/ItemTracker";
import ViewRequest from './pages/ViewRequest';
import ExecutiveApprovePage from "./pages/ExecutiveApprove";
import AdminPage from "./pages/AdminPage.jsx";
import HomePage from "./pages/HomePage"; 

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/new-request" element={<NewRequest />} />
          <Route path="/my-request" element={<MyRequest />} />
          <Route path="/item-tracker" element={<ItemTracker />} />
          <Route path="/view-request/:id" element={<ViewRequest />} />
          <Route path="/update-request/:id" element={<UpdateRequest />} />
          <Route path="/view-request/:id" element={<ViewRequest />} />
          <Route path="/executive-approve" element={<ExecutiveApprovePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
