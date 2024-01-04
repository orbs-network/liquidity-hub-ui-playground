import { RainbowProvider } from "./RainbowProvider";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ChakraProvider } from "@chakra-ui/react";
const client = new QueryClient();



function App() {
  return (
    <RainbowProvider>
      <ChakraProvider>
        <QueryClientProvider client={client}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ChakraProvider>
    </RainbowProvider>
  );
}

export default App;

