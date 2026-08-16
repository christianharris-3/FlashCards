import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Collections from "./pages/Collections.jsx";
import ViewCollection from "./pages/ViewCollection.jsx";
import LearnStartPage from "./pages/learnStartPage.jsx";
import LearnFlashCardPage from "./pages/LearnFlashCardPage.jsx";


const router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {path: "/", element: <Home />},
            {path: "/login", element: <Login />},
            {path: "/register", element: <Register />},
            {path: "/profile", element: <Profile />},
            {path: "/collections", element: <Collections />},
            {path: "/collections/:collectionId", element: <ViewCollection />},
            {path: "/learn", element: <LearnStartPage />},
            {path: "/learn/:learnType/:collectionId", element: <LearnFlashCardPage />}
        ]
    }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
