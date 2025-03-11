
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "@/components/ui/toaster";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

