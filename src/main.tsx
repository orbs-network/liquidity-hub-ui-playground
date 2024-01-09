import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { RainbowProvider } from "./RainbowProvider";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import "./index.css";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <RainbowProvider>
        <ChakraProvider>
          <RouterProvider router={router} />
        </ChakraProvider>
      </RainbowProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
