import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './Pages/Home';
import { ThemeProvider } from './components/theme/theme-provider';

function App() {
	return (
		<ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Home />} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
