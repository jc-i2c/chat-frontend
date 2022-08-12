import React, { useEffect, useState, useRef } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

import { useNavigate, useLocation } from "react-router-dom";
import io from "socket.io-client";

const socket = io.connect(process.env.REACT_APP_APIURL);

const RoomChat = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const inputRef = useRef(null);

  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [chatUser, setChatUser] = useState("");
  const [loginUser, setLoginUser] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadImageBuffer, setUploadImageBuffer] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [openImage, setOpenImage] = useState("");

  var getUserData = localStorage.getItem("user_data");
  getUserData = JSON.parse(getUserData);

  useEffect(() => {
    if (!location.state) {
      navigate("/userlist");
    } else {
      let propsObj = new Object();
      propsObj = location.state.data;

      setChatUser(propsObj);
      setLoginUser(getUserData);
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

    if (message || uploadImageBuffer) {
      let sendData = {
        chat_room_id: roomId,
        senderid: loginUser._id,
        receiverid: chatUser._id,
      };

      if (imageUrl) {
        const reader = new FileReader();
        reader.readAsDataURL(uploadImageBuffer);

        reader.onloadend = function () {
          sendData = { ...sendData, file: reader.result };
          socket.emit("sendMessageEmit", sendData);
        };

        setMessage("");
        setImageUrl("");
        return;
      } else {
        sendData = { ...sendData, message: message };
        socket.emit("sendMessageEmit", sendData);

        setMessage("");
        setImageUrl("");
        return;
      }
    }
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const fileHandle = (e) => {
    const uploadImages = e.target.files[0];
    setImageUrl(URL.createObjectURL(uploadImages));
    setUploadImageBuffer(uploadImages);
  };

  const logOut = () => {
    socket.emit("changeStatusEmit", getUserData._id);

    localStorage.removeItem("user_data");
    navigate("/chat");
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
                    {chatUser.islogin ? (
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
                    ) : (
                      <img
                        className="w-1/6 border-none rounded-lg"
                        src={"/chat/assets/img/red.png"}
                        alt={"Couldn't find image!"}
                        style={{
                          height: "10px",
                          width: "10px",
                          borderRadius: "50%",
                        }}
                      />
                    )}
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
                    logOut();
                  }}
                />
              </span>
            </div>
            <hr className="mt-1 border-b-1 border-blueGray-300" />
          </div>
          <div className="max-h-80 px-6 ">
            <div className="border-black-300 border-2">
              <ScrollToBottom className="h-80">
                {messageList.map((items, index) => {
                  if (items.senderid._id === loginUser._id) {
                    return (
                      <div
                        className="flex justify-end px-4 lg:px-10 py-2 pt-0"
                        key={index}
                      >
                        <div className="text-left mt-0.5 shadow-md text-green-700 shadow-green-500 px-3 py-1 w-fit max-w-sm">
                          <div className="font-extrabold pb-1">
                            {items.senderid.name}
                          </div>
                          {items.message ? (
                            <span className="text-black text-md">
                              {items.message}
                            </span>
                          ) : (
                            <img
                              data-toggle="modal"
                              data-target="#openImage"
                              className="rounded mx-auto d-block"
                              src={
                                // `${process.env.REACT_APP_PROFILEPIC}` +
                                items?.filename
                              }
                              alt={"Images!"}
                              style={{
                                height: "70px",
                                width: "70px",
                              }}
                              onClick={() => {
                                setOpenImage(items?.filename);
                              }}
                            />
                          )}
                          <div className="text-xs text-right">
                            {items.msgtime}
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
                            {items.senderid.name}
                          </div>
                          {items.message ? (
                            <span className="text-black text-md">
                              {items.message}
                            </span>
                          ) : (
                            <img
                              data-toggle="modal"
                              data-target="#openImage"
                              className="rounded mx-auto d-block"
                              src={
                                // `${process.env.REACT_APP_PROFILEPIC}` +
                                items?.filename
                              }
                              alt={"Images!"}
                              style={{
                                height: "70px",
                                width: "70px",
                              }}
                              onClick={() => {
                                setOpenImage(items?.filename);
                              }}
                            />
                          )}
                          <div className="text-xs text-right">
                            {items.msgtime}
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </ScrollToBottom>
            </div>
          </div>
          <form className="my-2 mt-2 px-4 lg:px-6" onSubmit={sendMessage}>
            <div className="flex space-x-3 d-flex justify-content-between align-items-center">
              <div className="relative w-10/12 mb-0 d-flex justify-content-between align-items-center">
                {imageUrl ? (
                  <img
                    className="rounded mx-auto d-block"
                    src={imageUrl && imageUrl}
                    alt={"Couldn't find images!"}
                    style={{
                      height: "100px",
                      width: "100px",
                    }}
                  />
                ) : (
                  <input
                    type="text"
                    value={message}
                    required
                    onChange={(e) => setMessage(e.target.value)}
                    className="px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-m shadow-md outline-none focus:outline-none  w-full ease-linear transition-all duration-150"
                    placeholder="Tpye message here..."
                  />
                )}
                <img
                  className="rounded mx-auto d-block"
                  src="/chat/assets/img/image.png"
                  alt={"Couldn't find images!"}
                  style={{
                    height: "40px",
                    width: "40px",
                  }}
                  onClick={() => {
                    handleClick();
                  }}
                />
              </div>

              <div>
                <input
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                  name="image"
                  accept="image/gif,image/jpeg,image/jpg,image/png"
                  ref={inputRef}
                  data-original-title="upload photos"
                  onChange={(e) => {
                    fileHandle(e);
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

      {/* Modal */}
      <div
        className="modal"
        id="openImage"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="d-flex justify-content-center">
              {<img src={`${process.env.REACT_APP_PROFILEPIC}` + openImage} />}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary bg-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomChat;
