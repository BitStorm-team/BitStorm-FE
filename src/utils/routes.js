import Dashboard from "../pages/DashBoard";
import Contact from "../pages/Contact";

import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Comment from "../pages/Comment";
import User from "../pages/User";
import Expert from "../pages/Expert";

import LayoutAdmin from "../components/layout";
import Post from "../pages/Post";
import Booking from "../pages/Booking";

export const publicRoutes = [
  {
    path: "/signin",
    element: <SignIn />,
    exact: true,
  },
  {
    path: "/signup",
    element: <SignUp />,
    exact: true,
  },
];

export const privateRoutes = [
  {
    path: "/",
    element: <LayoutAdmin main={<Dashboard />} />,
    exact: true,
  },
  {
    path: "/dashboard",
    element: <LayoutAdmin main={<Dashboard />} />,
    exact: true,
  },
  {
    path: "/posts",
    element: <LayoutAdmin main={<Post />} />,
    exact: true,
  },
  {
    path: "/comments",
    element: <LayoutAdmin main={<Comment />} />,
    exact: true,
  },
  {
    path: "/user",
    element: <LayoutAdmin main={<User />} />,
    exact: true,
  },
  {
    path: "/expert",
    element: <LayoutAdmin main={<Expert />} />,
    exact: true,
  },
  {
    path: "/contact",
    element: <LayoutAdmin main={<Contact />} />,
    exact: true,
  },
  {
    path: "/booking",
    element: <LayoutAdmin main={<Booking />} />,
    exact: true,
  },
];
