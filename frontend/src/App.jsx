import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";
import { PostPage } from "./pages/Post/PostPage";
import { MyProfile } from "./pages/MyProfile/MyProfile";


// docs: https://reactrouter.com/en/main/start/overview
const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/signup",
        element: <SignupPage />,
    },
    {
        path: "/posts",
        element: <FeedPage />,
    },
    {
        path: "/profile",
        element: <MyProfile />,
    },
    { path: "/posts/:id", element: <PostPage /> },
]);

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
