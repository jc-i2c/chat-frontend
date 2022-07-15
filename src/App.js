import React from "react";
import { Route, Routes } from "react-router-dom";

import Chat from "./pages/Chat/Chat";
import Login from "./pages/Chat/Login";
import RoomChat from "./pages/Chat/RoomChat";
import Userlist from "./pages/Chat/Userlist";

const App = () => {
  return (
    <Routes>
      <Route path="/chat" element={<Chat />} />
      <Route path="/login" element={<Login />} />
      <Route path="/userlist" element={<Userlist />} />
      <Route path="/roomchat" element={<RoomChat />} />
    </Routes>
  );
};

export default App;
