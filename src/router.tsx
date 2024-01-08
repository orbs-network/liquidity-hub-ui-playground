import { createBrowserRouter, Navigate } from "react-router-dom";
import { App } from "./App";
import { ROUTES } from "./consts";

export const router = createBrowserRouter([
  {
    element: <App />,
    path: "/:partner",
  },
  {
    element: <Navigate to={ROUTES.quickswap} />,
    path: "*",
  },
]);
