import axios from "axios";

import React, { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";

import io from "socket.io-client";
const socket = io.connect(process.env.REACT_APP_APIURL);

const Login = () => {
  const navigate = useNavigate();

  var userData = localStorage.getItem("user_data");
  userData = JSON.parse(userData);

  const [emailAddress, setEmailAddress] = useState("");
  const [error, setError] = useState({});

  useEffect(() => {
    if (userData) {
      navigate("/userlist");
    }
    setError({});
  }, [emailAddress]);

  const submitFormData = (e) => {
    e.preventDefault();
    setError({});

    if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailAddress) ||
      !emailAddress
    ) {
      setError({ wrongUserCode: true });
      return;
    } else {
      axios
        .post(`${process.env.REACT_APP_APIURL}/users/codeverify`, {
          email_address: emailAddress,
        })
        .then((data) => {
          if (data.data.success) {
            localStorage.setItem("user_data", JSON.stringify(data.data.data));
            toast.success(data.data.message);

            socket.emit("changeStatusEmit", data.data.data._id);
            navigate("/userlist");
          } else {
            toast.error(data.data.message);
          }
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
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
                          <h6 className="text-blueGray-500 text-m font-bold">
                            User Login
                          </h6>
                        </div>
                        <hr className="mt-6 border-b-1 border-blueGray-300" />
                      </div>
                      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                        <form onSubmit={submitFormData}>
                          <div className="relative w-full mb-3">
                            <label
                              className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                              htmlFor="grid-password"
                            >
                              User Email Address
                            </label>
                            <input
                              type="email"
                              value={emailAddress}
                              onChange={(e) => {
                                setEmailAddress(e.target.value);
                              }}
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                              placeholder="Enter your email address"
                            />
                            <p className="my-2 text-sm text-red-700 px-2">
                              {error.wrongUserCode &&
                                "Please enter valid email address"}
                            </p>
                          </div>

                          <div>
                            <div className="text-center mt-6">
                              <button
                                className="text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                style={{ backgroundColor: "#1E293B" }}
                                type="submit"
                              >
                                submit
                              </button>
                              <button
                                className="text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                style={{ backgroundColor: "#1E293B" }}
                                type="submit"
                                onClick={() => navigate(-1)}
                              >
                                Back
                              </button>
                            </div>
                          </div>
                        </form>
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

export default Login;
