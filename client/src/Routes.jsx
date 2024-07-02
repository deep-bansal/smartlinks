import { useEffect } from "react";
import {
	createBrowserRouter,
	RouterProvider,
	Route,
	Link,
	Navigate,
	useNavigate,
} from "react-router-dom";
import TextEditor from "./components/TextEditor";
import Login from "./components/Login";
import App from "./App.jsx";
import { v4 as uuidv4 } from "uuid";

const NavigateToDocument = () => {
	// Perform navigation to /document/{uuidv4}
	const navigateToDocument = useNavigate();
	const id = uuidv4();

	useEffect(() => {
		navigateToDocument(`/document/${id}`, { replace: true });
	}, [navigateToDocument, id]);

	// Render null to indicate no visible content
	return null;
};

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/document",
		element: <NavigateToDocument />,
	},
	{
		path: "/document/:id",
		element: <TextEditor />,
	},
	{
		path: "login",
		element: <Login />,
	},
]);

export default router;
