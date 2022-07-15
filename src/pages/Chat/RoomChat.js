import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

import io from "socket.io-client";

import { useNavigate, useLocation } from "react-router-dom";

const socket = io.connect(process.env.REACT_APP_APIURL);

const RoomChat = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [chatUser, setChatUser] = useState("");
  const [loginUser, setLoginUser] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    let propsObj = new Object();
    propsObj = location.state.data;

    if (Object.keys(propsObj).length > 0) {
      setChatUser(propsObj);

      var getUserData = localStorage.getItem("user_data");
      getUserData = JSON.parse(getUserData);
      setLoginUser(getUserData);
    } else {
      navigate("/chat");
    }
  }, []);

  // Find or create room
  useEffect(() => {
    if (loginUser !== "" && chatUser !== "") {
      let findRoomData = { userid: loginUser._id, otheruserid: chatUser._id };
      socket.emit("findRoomEmit", findRoomData);
    }
  }, [loginUser, chatUser]);

  // Get all message
  useEffect(() => {
    if (roomId !== "") {
      socket.emit("getAllMessageEmit", roomId);
    }
  }, [roomId]);

  // SOCKET effect
  useEffect(() => {
    socket.on("findRoomOn", function (roomId) {
      setRoomId(roomId);
    });

    socket.on("getAllMessageOn", function (chatList) {
      setMessageList(chatList);
    });

    socket.on("sendMessageOn", function (newChatMessage) {
      setMessageList((prevMsgList) => {
        if (prevMsgList.some((item) => item._id == newChatMessage._id)) {
          return prevMsgList;
        } else {
          return [...prevMsgList, newChatMessage];
        }
      });
    });
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();

    let sendData = {
      chat_room_id: roomId,
      senderid: loginUser._id,
      receiverid: chatUser._id,
      message: message,
    };

    socket.emit("sendMessageEmit", sendData);
    setMessage("");
  };

  const fileOpen = () => {
    return (
      <input
        type="file"
        id="file"
        style="display: none"
        name="image"
        accept="image/gif,image/jpeg,image/jpg,image/png"
        multiple=""
        data-original-title="upload photos"
      />
    );
  };

  return (
    <>
      <div className="w-full lg:w-8/12 h-10/12 px-4">
        <div className="relative flex flex-col shadow-white min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
          <div className="rounded-t mb-0 px-6 py-6">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-blueGray-500 text-lg text-left font-extrabold">
                <div className="relative w-full mb-3 ml-2 d-flex justify-content-between align-items-center">
                  <img
                    src="/chat/assets/img/team-4-470x470.png"
                    alt={"Couldn't find profile!"}
                    style={{
                      height: "40px",
                      width: "40px",
                      borderRadius: "50%",
                    }}
                  />
                  <div>
                    {`${chatUser?.name}`}
                    <img
                      className="w-1/6 border-none rounded-lg"
                      src={"/chat/assets/img/green.png"}
                      alt="..."
                      style={{
                        height: "10px",
                        width: "10px",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                </div>
              </span>
              <span className="text-blueGray-500 text-lg text-right font-extrabold">
                <img
                  src="/chat/assets/img/logout.svg"
                  alt={"Couldn't find profile!"}
                  style={{
                    height: "35px",
                    width: "35px",
                  }}
                  onClick={() => {
                    localStorage.removeItem("user_data");
                    navigate("/chat");
                  }}
                />
              </span>
            </div>
            <hr className="mt-1 border-b-1 border-blueGray-300" />
          </div>
          <div className="max-h-80 px-6 ">
            <div className="border-black-300 border-2">
              <ScrollToBottom className="h-80">
                {messageList.map((messageData, index) => {
                  if (messageData.senderid._id === loginUser._id) {
                    return (
                      <div
                        className="flex justify-end px-4 lg:px-10 py-2 pt-0"
                        key={index}
                      >
                        <div className="text-left mt-0.5 shadow-md text-green-700 shadow-green-500 px-3 py-1 w-fit max-w-sm">
                          <div className="font-extrabold pb-1">
                            {messageData.senderid.name}
                          </div>
                          <span className="text-black text-md">
                            {messageData.message}
                          </span>
                          <div className="text-xs text-right">
                            {messageData.msgtime}
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        className="flex-auto px-4 lg:px-10 py-2 pt-0"
                        key={index}
                      >
                        <div className="text-left mt-2 shadow-md text-orange-700 shadow-orange-500 px-3 py-1 w-fit max-w-sm">
                          <div className="font-extrabold pb-1">
                            {messageData.senderid.name}
                          </div>
                          <span className="text-black text-md">
                            {messageData.message}
                          </span>
                          <div className="text-xs text-right">
                            {messageData.msgtime}
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </ScrollToBottom>
            </div>
          </div>
          <form className="my-2 mt-4 px-4 lg:px-6" onSubmit={sendMessage}>
            <div className="flex space-x-3">
              <div className="relative w-10/12 mb-3 d-flex justify-content-between align-items-center">
                <input
                  type="text"
                  value={message}
                  required
                  onChange={(e) => setMessage(e.target.value)}
                  className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow-md outline-none focus:outline-none  w-full ease-linear transition-all duration-150"
                  placeholder="Tpye message here ..."
                />
                <img
                  src="/chat/assets/img/image.png"
                  alt={"Couldn't find images!"}
                  style={{
                    height: "35px",
                    width: "35px",
                  }}
                  onClick={() => {
                    fileOpen();
                  }}
                />
              </div>
              <div className="text-center w-2/12">
                <button
                  className="text-white  text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  style={{ backgroundColor: "#1E293B" }}
                  type="submit"
                >
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RoomChat;
