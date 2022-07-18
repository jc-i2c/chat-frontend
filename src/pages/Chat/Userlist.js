import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import io from "socket.io-client";
const socket = io.connect(process.env.REACT_APP_APIURL);

const Userlist = () => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);

  var userData = localStorage.getItem("user_data");
  userData = JSON.parse(userData);

  useEffect(() => {
    if (!userData) {
      navigate("/chat");
      return;
    } else {
      socket.emit("userListEmit");
    }
  }, []);

  // SOCKET effect
  useEffect(() => {
    socket.on("userListOn", function (listAllUsers) {
      setUserList(() => {
        return listAllUsers.filter((item) => item._id !== userData._id);
      });
    });

    socket.on("updateUserEmit", function (userId) {
      setUserList(
        userList.map((user) => {
          if (user._id == userId) {
            return { ...user, islogin: !user.islogin };
          } else {
            return user;
          }
        })
      );
    });
  }, [socket]);

  const gotoChatRoom = (chatUser) => {
    navigate("/roomchat", {
      state: { data: chatUser },
    });
  };

  return (
    <>
      <div>
        <main className="mt-18">
          <section className={`relative w-full py-40 h-full min-h-screen`}>
            <div
              className="absolute top-0 w-full h-full bg-full"
              style={{
                backgroundImage: `url("/chat/assets/img/register_bg_2.png")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundColor: "lightgray",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="container mx-auto px-4 h-full">
                <div className="flex content-center items-center justify-center h-full">
                  <div className="w-full lg:w-4/12 px-4">
                    <div className="relative flex flex-col shadow-white min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                      <div className="rounded-t mb-0 px-6 py-6">
                        <div className="text-center mb-3">
                          <h2 className="text-blueGray-500 font-bold">
                            User List
                          </h2>
                        </div>
                        <hr className="mt-6 border-b-1 border-blueGray-300" />
                      </div>
                      <div className="flex-auto px-4 lg:px-10 py-1 pt-0">
                        {userList &&
                          userList.map((list, index) => (
                            <div
                              className="relative w-full mb-3 d-flex justify-content-between align-items-center"
                              key={index}
                            >
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
                                <label className="text-blueGray-500 text-m font-bold">
                                  {list?.name}
                                </label>
                                <h4 className="block lowercase text-blueGray-600 text-xs font-bold mb-2">
                                  {list?.email_address}
                                </h4>
                              </div>
                              {list.islogin ? (
                                <img
                                  className="w-1/6 border-none rounded-lg"
                                  src={"/chat/assets/img/green.png"}
                                  alt={"Couldn't find image!"}
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
                              <img
                                src="/chat/assets/img/comment_2.svg"
                                alt={"Couldn't find profile!"}
                                style={{
                                  height: "35px",
                                  width: "35px",
                                }}
                                onClick={() => gotoChatRoom(list)}
                              />
                              <hr />
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Userlist;
