import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme/theme-provider";
import { Home } from "./pages/home";
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
