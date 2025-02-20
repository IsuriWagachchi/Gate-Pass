import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import NewRequest from "./pages/NewRequest";
import MyRequest from "./pages/MyRequest";
import UpdateRequest from './pages/UpdateRequest';
import ItemTracker from "./pages/ItemTracker";
import ViewRequest from './pages/ViewRequest';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/new-request" element={<NewRequest />} />
          <Route path="/my-request" element={<MyRequest />} />
          <Route path="/item-tracker" element={<ItemTracker />} />
          <Route path="/update-request/:id" element={<UpdateRequest />} />
          <Route path="/view-request/:id" element={<ViewRequest />} />
          <Route path="/" element={<h2 style={{ textAlign: "center" }}>Welcome to the Gate Pass System</h2>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
