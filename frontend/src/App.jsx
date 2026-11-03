import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Navigator from './pages/Navigator.jsx';
import Results from './pages/Results.jsx';
import Calculator from './pages/Calculator.jsx';
import Explore from './pages/Explore.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigator />} />
        <Route path="results" element={<Results />} />
        <Route path="calculator" element={<Calculator />} />
        <Route path="explore" element={<Explore />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
