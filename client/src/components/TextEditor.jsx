import React, { useEffect, useRef, useState } from "react";
import "./textEditor.css";
import Quill from "quill";
import { io } from "socket.io-client";
import "quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";

const toolbarOptions = [
	[{ header: [1, 2, 3, 4, 5, 6, false] }], // custom button values
	[{ font: [] }],
	[{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
	["bold", "italic", "underline", "strike"], // toggled buttons
	[{ color: [] }, { background: [] }], // dropdown with defaults from theme
	[{ script: "sub" }, { script: "super" }], // superscript/subscript
	[{ align: [] }],
	["link", "image", "video", "formula"],
	["clean"], // remove formatting button
	[{ indent: "-1" }, { indent: "+1" }], // outdent/indent
	[{ direction: "rtl" }], // text direction

	[{ size: ["small", false, "large", "huge"] }],
];

function TextEditor() {
	const { id: articleId } = useParams();
	const wrapper = useRef();
	const [socket, setSocket] = useState();
	const [quill, setQuill] = useState();

	// for creating a new document
	useEffect(() => {
		if (socket == null || quill == null) return;
		socket.once("load-document", (article) => {
			quill.setContents(article);
			quill.enable();
		});
		socket.emit("get-document", articleId);
	}, [articleId, socket, quill]);

	// for saving the document
	useEffect(() => {
		if (socket == null || quill == null) return;
		const interval = setInterval(() => {
			socket.emit("save-document", quill.getContents());
		}, 2000);
		return () => {
			clearInterval(interval);
		};
	}, [socket, quill]);

	// for connection to the server
	useEffect(() => {
		const socket = io("http://localhost:3001");
		setSocket(socket);
		return () => {
			socket.disconnect();
		};
	}, []);

	// detecting changes in the editor and sending it to the server
	useEffect(() => {
		if (socket == null || quill == null) return;
		const handler = (delta, oldDelta, source) => {
			if (source == "api") {
				console.log("An API call triggered this change.");
			} else if (source == "user") {
				socket.emit("send-changes", delta);
			}
		};
		quill.on("text-change", handler);

		return () => {
			quill.off("text-change", handler);
		};
	}, [socket, quill]);

	// receiving changes from the server
	useEffect(() => {
		if (socket == null || quill == null) return;
		const handler = (delta) => {
			quill.updateContents(delta);
		};
		socket.on("receive-changes", handler);

		return () => {
			socket.off("receive-changes", handler);
		};
	}, [socket, quill]);

	// quill editor initialization
	useEffect(() => {
		const editor = document.createElement("div");
		wrapper.current.append(editor);
		const quill = new Quill(editor, {
			modules: {
				toolbar: toolbarOptions,
			},
			theme: "snow",
		});
		quill.disable();
		setQuill(quill);

		return () => {
			wrapper.current.innerHTML = "";
		};
	}, []);
	return <div className="container" ref={wrapper}></div>;
}

export default TextEditor;
