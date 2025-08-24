// frontend/src/App.tsx
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import LeadsPage from "./pages/leads/LeadsPage";
import MessagesPage from "./pages/messages/MessagesPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

type Page = "dashboard" | "leads" | "messages";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "leads":
        return <LeadsPage />;
      case "messages":
        return <MessagesPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Layout
          currentPage={currentPage}
          onNavigate={setCurrentPage}>
          {renderPage()}
        </Layout>
      </div>
    </QueryClientProvider>
  );
}

export default App;
