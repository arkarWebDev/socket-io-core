import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");
const username = nanoid(8);

type Message = {
  message: string;
  username: string;
};

const App = () => {
  const [message, setMessage] = useState("");
  const [groupMessages, setGroupMessages] = useState<Message[]>([]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.length === 0) return;
    socket.emit("send message", { message, username });
    setMessage("");
  };

  useEffect(() => {
    socket.on("join noti", ({ message, username }: Message) => {
      const userName = username ? username : "";
      setGroupMessages((prev) => [...prev, { message, username: userName }]);
    });

    socket.on("send message", ({ username, message }: Message) => {
      setGroupMessages((prev) => [...prev, { message, username }]);
    });

    socket.on("leave noti", ({ message, username }: Message) => {
      const userName = username ? username : "";
      setGroupMessages((prev) => [...prev, { message, username: userName }]);
    });
  }, []);

  return (
    <>
      <div className="layout">
        <nav>
          <h2>Unknow Profile</h2>
          <p>A simple group chat with socket.io</p>
        </nav>
        <main>
          <div className="msg-layout">
            {groupMessages.map((msg, index) => (
              <div key={index} className="msg-box">
                <div className="message">{msg.message}</div>
                {msg.username !== "" && (
                  <div className="sender">user id - {msg.username}</div>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
            />
            <button type="submit">Send</button>
          </form>
        </main>
      </div>
    </>
  );
};

export default App;
