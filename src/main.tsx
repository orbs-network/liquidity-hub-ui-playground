import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { RainbowProvider } from "./RainbowProvider";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import "./index.css";



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>

      <RainbowProvider>
        <ChakraProvider>
          <RouterProvider router={router} />
        </ChakraProvider>
      </RainbowProvider>

  </React.StrictMode>
);
