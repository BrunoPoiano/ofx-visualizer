import "./App.css";
import { HomePage } from "./components/pages/Home";
import { ThemeProvider } from "./components/theme-provider";
import { Route, BrowserRouter, Routes } from "react-router-dom";
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
