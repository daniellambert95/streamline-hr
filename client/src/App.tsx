import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} /> {/* Add this line */}
          {/* Add other routes here */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;