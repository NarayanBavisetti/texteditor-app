import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Moment from "react-moment";
import { io } from "socket.io-client";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import Picker from "emoji-picker-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import parse from "html-react-parser";

const Chat = () => {
  const location = useLocation();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [allMessages, setMessages] = useState([]);
  const [socket, setSocket] = useState();
  const [showPicker, setShowPicker] = useState(false);
  const [cmt, setCmt] = useState("");

  const onEmojiClick = (event, emojiObject) => {
    setCmt(cmt + emojiObject.emoji);
    setShowPicker(false);
  };

  useEffect(() => {
    const socket = io("http://localhost:9000");
    setSocket(socket);

    socket.on("connect", () => {
      console.log("socket Connected");
      socket.emit("joinRoom", location.state.room);
    });
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("getLatestMessage", (newMessage) => {
        console.log(allMessages);
        console.log(newMessage);
        setMessages([...allMessages, newMessage]);
        setCmt("");
        setLoading(false);
      });
    }
  }, [socket, allMessages]);

  useEffect(() => {
    setData(location.state);
  }, [location]);

  const onSubmit = () => {
    if (cmt) {
      setLoading(true);
      const newMessage = { time: new Date(), cmt, name: data.name };
      socket.emit("newMessage", { newMessage, room: data.room });
    }
  };

  return (
    <div className="py-4 m-5 w-50 shadow bg-white text-dark border rounded container">
      <div className="text-center px-3 mb-4 text-capitalize">
        <h1 className="text-warning mb-4">{data?.room} Chat Room</h1>
      </div>
      <div
        className="bg-light border rounded p-3 mb-4"
        style={{ height: "450px", overflowY: "scroll" }}
      >
        {allMessages.map((cmt) => {
          return data.name === cmt.name ? (
            <div className="row justify-content-end pl-5 ">
              <div className="d-flex flex-column align-items-end m-2 shadow p-2 bg-info border rounded w-auto">
                <div>
                  <strong className="m-1">{cmt.name}</strong>
                  <small className="text-muted m-1">
                    <Moment fromNow>{cmt.time}</Moment>
                  </small>
                </div>
                <h4 className="m-1">{parse(cmt.cmt)}</h4>
              </div>
            </div>
          ) : (
            <div className="row justify-content-start">
              <div className="d-flex flex-column m-2 p-2 shadow bg-white border rounded w-auto">
                <div>
                  <strong className="m-1">{cmt.name}</strong>
                  <small className="text-mmuted m-1">
                    <Moment fromNow>{cmt.time}</Moment>
                  </small>
                </div>
                <h4 className="m-1">{parse(cmt.cmt)}</h4>
              </div>
            </div>
          );
        })}
      </div>
      <div className="form-group d-flex">
        <div>
          <CKEditor
            editor={ClassicEditor}
            data={cmt}
            onChange={(event, editor) => {
              const data = editor.getData();
              setCmt(data);
            }}
          />
        </div>
        <div>
          <InsertEmoticonIcon onClick={() => setShowPicker((val) => !val)} />
          {showPicker && (
            <Picker
              pickerStyle={{ width: "100%" }}
              onEmojiClick={onEmojiClick}
            />
          )}
        </div>

        <button
          type="button"
          className="btn btn-warning mx-2"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <div class="spinner-border spinner-border-sm text-primary"></div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-send"
              viewBox="0 0 16 16"
            >
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Chat;
