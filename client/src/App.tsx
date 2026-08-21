/** Ledger & Signal design reminder: the app remains a calm, evidence-led operations workspace. */
import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><Toaster richColors position="top-right" /><Home /></ThemeProvider></ErrorBoundary>;
}

export default App;
