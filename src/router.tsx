import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./Layout";
import { Partner } from "./partners/Partner";

export const router = createBrowserRouter([
  {
    path: "/:partner",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Partner />,
      },
    ],
  },
  {
    element: <Navigate to="/quickswap" />,
    path: "*",
  },
]);
