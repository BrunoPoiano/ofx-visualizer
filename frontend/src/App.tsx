import "./App.css";
import { HomePage } from "./components/pages/Home";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme/theme-provider";
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
