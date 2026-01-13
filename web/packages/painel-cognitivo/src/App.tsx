import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from './presentation/pages/DashboardPage';
import './styles/app.css';

export default function App() {
  return (
    <div className="painel-cognitivo">
      <Routes>
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </div>
  );
}
