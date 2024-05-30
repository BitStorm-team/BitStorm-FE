import Contact from "../pages/Contact";
import Dashboard from "../pages/DashBoard";

import Comment from "../pages/Comment";
import Expert from "../pages/Expert";
import SignIn from "../pages/SignIn";
import User from "../pages/User";

import LayoutAdmin from "../components/layout";
import Booking from "../pages/Booking";
import Post from "../pages/Post";

export const publicRoutes = [
  {
    path: "/signin",
    element: <SignIn />,
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
