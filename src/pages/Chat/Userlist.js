import axios from "axios";

import React, { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Userlist = () => {
  const navigate = useNavigate();

  const [userList, setUserList] = useState([]);

  var userData = localStorage.getItem("user_data");
  userData = JSON.parse(userData);

  useEffect(() => {
    if (!userData) {
      navigate("/chat");
      return;
    }

    axios
      .get(`${process.env.REACT_APP_APIURL}/users/allusers`)
      .then((data) => {
        if (data.data.success) {
          setUserList(() => {
            return data.data.data.filter((item) => item._id !== userData._id);
          });
        } else {
          toast.error(data.data.message);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

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
                  <ToastContainer />
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
