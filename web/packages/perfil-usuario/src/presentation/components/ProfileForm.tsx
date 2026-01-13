import { useState, useEffect } from 'react';
import { LocalStorageUserProfileRepository } from '../../infrastructure/repositories/LocalStorageUserProfileRepository';
import { GetUserProfileUseCase } from '../../application/useCases/GetUserProfileUseCase';
import { UpdateUserProfileUseCase } from '../../application/useCases/UpdateUserProfileUseCase';
import './ProfileForm.css';

const repository = new LocalStorageUserProfileRepository();
const getProfileUseCase = new GetUserProfileUseCase(repository);
const updateProfileUseCase = new UpdateUserProfileUseCase(repository);

const NEURODIVERGENCE_OPTIONS = ['TDAH', 'TEA (Autismo)', 'Dislexia', 'Ansiedade', 'Outro'];
const DAYS_OPTIONS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAYS_LABELS: Record<string, string> = {
  monday: 'Seg',
  tuesday: 'Ter',
  wednesday: 'Qua',
  thursday: 'Qui',
  friday: 'Sex',
  saturday: 'Sáb',
  sunday: 'Dom'
};

export function ProfileForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [neurodivergence, setNeurodivergence] = useState<string[]>([]);
  const [specificNeeds, setSpecificNeeds] = useState<string[]>([]);
  const [needInput, setNeedInput] = useState('');
  const [studyDays, setStudyDays] = useState<string[]>([]);
  const [studyStart, setStudyStart] = useState('09:00');
  const [studyEnd, setStudyEnd] = useState('18:00');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const userProfile = await getProfileUseCase.execute();
    if (userProfile) {
      setName(userProfile.name);
      setEmail(userProfile.email);
      setBio(userProfile.bio || '');
      setNeurodivergence(userProfile.neurodivergence || []);
      setSpecificNeeds(userProfile.specificNeeds);
      if (userProfile.studyRoutine) {
        setStudyDays(userProfile.studyRoutine.days);
        setStudyStart(userProfile.studyRoutine.startTime);
        setStudyEnd(userProfile.studyRoutine.endTime);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateProfileUseCase.execute({
      name,
      email,
      bio,
      neurodivergence,
      specificNeeds,
      studyRoutine: studyDays.length > 0 ? {
        days: studyDays,
        startTime: studyStart,
        endTime: studyEnd,
        breakInterval: 60,
        subjects: []
      } : undefined
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const toggleNeurodivergence = (option: string) => {
    setNeurodivergence(prev =>
      prev.includes(option) ? prev.filter(n => n !== option) : [...prev, option]
    );
  };

  const addNeed = () => {
    if (needInput.trim() && !specificNeeds.includes(needInput.trim())) {
      setSpecificNeeds([...specificNeeds, needInput.trim()]);
      setNeedInput('');
    }
  };

  const removeNeed = (need: string) => {
    setSpecificNeeds(specificNeeds.filter(n => n !== need));
  };

  const toggleStudyDay = (day: string) => {
    setStudyDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <form className="profile-form" onSubmit={handleSave}>
      {showSuccess && (
        <div className="success-message">
          ✅ Perfil salvo com sucesso!
        </div>
      )}

      <div className="profile-form__section">
        <h2 className="profile-form__section-title">👤 Informações Pessoais</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Nome Completo *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail *</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-row form-row--single">
          <div className="form-group">
            <label htmlFor="bio">Sobre Você</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Conte um pouco sobre você..."
            />
          </div>
        </div>
      </div>

      <div className="profile-form__section">
        <h2 className="profile-form__section-title">🧠 Neurodivergência</h2>
        <div className="checkbox-group">
          {NEURODIVERGENCE_OPTIONS.map(option => (
            <div key={option} className="checkbox-item">
              <input
                type="checkbox"
                id={`neuro-${option}`}
                checked={neurodivergence.includes(option)}
                onChange={() => toggleNeurodivergence(option)}
              />
              <label htmlFor={`neuro-${option}`}>{option}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-form__section">
        <h2 className="profile-form__section-title">⚙️ Necessidades Específicas</h2>
        <div className="needs-list">
          {specificNeeds.map((need, index) => (
            <span key={index} className="need-tag">
              {need}
              <button type="button" onClick={() => removeNeed(need)}>✕</button>
            </span>
          ))}
        </div>
        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              value={needInput}
              onChange={(e) => setNeedInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNeed())}
              placeholder="Digite uma necessidade e pressione Enter"
            />
          </div>
        </div>
      </div>

      <div className="profile-form__section">
        <h2 className="profile-form__section-title">📚 Rotina de Estudo</h2>
        <div className="form-group">
          <label>Dias de Estudo</label>
          <div className="checkbox-group">
            {DAYS_OPTIONS.map(day => (
              <div key={day} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`day-${day}`}
                  checked={studyDays.includes(day)}
                  onChange={() => toggleStudyDay(day)}
                />
                <label htmlFor={`day-${day}`}>{DAYS_LABELS[day]}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="time-inputs">
          <div className="form-group">
            <label htmlFor="study-start">Horário de Início</label>
            <input
              id="study-start"
              type="time"
              value={studyStart}
              onChange={(e) => setStudyStart(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="study-end">Horário de Término</label>
            <input
              id="study-end"
              type="time"
              value={studyEnd}
              onChange={(e) => setStudyEnd(e.target.value)}
            />
          </div>
        </div>
      </div>

      <button type="submit" className="save-button">
        💾 Salvar Perfil
      </button>
    </form>
  );
}
