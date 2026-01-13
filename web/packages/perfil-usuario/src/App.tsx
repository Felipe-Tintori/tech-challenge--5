import { Routes, Route } from 'react-router-dom';
import { ProfileForm } from './presentation/components/ProfileForm';
import './styles/app.css';

function ProfilePage() {
  return (
    <div className="perfil-usuario">
      <header className="perfil-usuario__header">
        <h1>⚙️ Perfil e Configurações</h1>
        <p>Gerencie suas informações e preferências pessoais</p>
      </header>

      <div className="perfil-usuario__content">
        <ProfileForm />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProfilePage />} />
    </Routes>
  );
}
