import React, { useState, useEffect } from "react";
import io, { connect } from "socket.io-client";
const socket = io.connect("https://socketio-group-server.onrender.com");

const Body = () => {
  const [roomID, setroomID] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      setroomID(room);
    } else {
      socket.emit("join_room", "");
      setroomID("");
      // Send an empty string to join a random room
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room: roomID });
    setMessage(""); // Clear input after sending message
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setReceivedMessages((prevMessages) => [
        ...prevMessages,
        { message: data.message, type: "received" },
      ]);
    });

    socket.on("user_disconnected", (data) => {
      setReceivedMessages((prevMessages) => [
        ...prevMessages,
        { message: data.message, type: "disconnected" },
      ]);
    });
    socket.on("user_paired", (data) => {
      setroomID(data.room);
    });

    // Clean up socket listener on component unmount
    return () => {
      socket.off("receive_message");
      socket.off("user_disconnected");
      socket.off("user_paired");
    };
  }, []);

  const addSentMessage = () => {
    setReceivedMessages((prevMessages) => [
      ...prevMessages,
      { message: message, type: "sent" },
    ]);
  };
  return (
    <div
      className="flex flex-col "
      style={{
        height: "92vh",
      }}
    >
      <div className="bg-gray-200 p-2">
        {/* Room creation or selection UI */}
        <div className="mt-auto flex items-center">
          <input
            type="text"
            className="w-full border rounded-lg py-2 px-3 mr-2 focus:outline-none"
            placeholder="Creat Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
            onClick={joinRoom}
          >
            Create
          </button>
        </div>
      </div>
      <div className="bg-white flex-1 flex flex-col">
        {/* Chat UI */}
        <div className="overflow-y-auto p-4 flex-1">
          {/* Chat messages */}
          <div className="chat-container">
            <h1 className="font-bold bg-gray-200 p-1 rounded-lg m-1">
              Room ID: {roomID}
            </h1>
            <div className="flex justify-center items-center ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200"
                style={{
                  width: "75px",
                  height: "75px",
                }}
              >
                <circle
                  fill="#3F7BFF"
                  stroke="#3F7BFF"
                  stroke-width="2"
                  r="15"
                  cx="40"
                  cy="65"
                >
                  <animate
                    attributeName="cy"
                    calcMode="spline"
                    dur="2.7"
                    values="65;135;65;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="-.4"
                  ></animate>
                </circle>
                <circle
                  fill="#3F7BFF"
                  stroke="#3F7BFF"
                  stroke-width="2"
                  r="15"
                  cx="100"
                  cy="65"
                >
                  <animate
                    attributeName="cy"
                    calcMode="spline"
                    dur="2.7"
                    values="65;135;65;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="-.2"
                  ></animate>
                </circle>
                <circle
                  fill="#3F7BFF"
                  stroke="#3F7BFF"
                  stroke-width="2"
                  r="15"
                  cx="160"
                  cy="65"
                >
                  <animate
                    attributeName="cy"
                    calcMode="spline"
                    dur="2.7"
                    values="65;135;65;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="0"
                  ></animate>
                </circle>
              </svg>
            </div>
            {receivedMessages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.type === "sent"
                    ? "flex justify-end mb-2"
                    : "flex justify-start mb-2"
                }
              >
                <div
                  className={
                    msg.type === "sent"
                      ? "bg-green-600 text-white p-3 rounded-l-full rounded-br-full max-w-3/4"
                      : "bg-blue-600 text-white p-3 rounded-r-full rounded-bl-full max-w-3/4"
                  }
                >
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Input message and send button */}
        <div className="p-4 border-t">
          <div className="mt-auto flex items-center">
            <input
              type="text"
              className="w-full border rounded-lg py-2 px-3 mr-2 focus:outline-none"
              placeholder="Type your message..."
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
              }}
            />
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
              onClick={() => {
                sendMessage();
                addSentMessage();
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
