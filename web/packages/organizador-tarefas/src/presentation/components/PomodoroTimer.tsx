import { useState, useEffect, useRef } from 'react';
import './PomodoroTimer.css';

type PomodoroMode = 'work' | 'break' | 'long-break';

const WORK_TIME = 25 * 60; // 25 minutos
const BREAK_TIME = 5 * 60; // 5 minutos
const LONG_BREAK_TIME = 15 * 60; // 15 minutos
const SESSIONS_UNTIL_LONG_BREAK = 4;
const FOCUS_TIME_THRESHOLD = 90 * 60; // 90 minutos para alerta cognitivo

export function PomodoroTimer() {
  const [mode, setMode] = useState<PomodoroMode>('work');
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [showCognitiveAlert, setShowCognitiveAlert] = useState(false);
  
  const intervalRef = useRef<number | null>(null);
  const totalTimeRef = useRef(WORK_TIME);

  const getModeDuration = (m: PomodoroMode) => {
    switch (m) {
      case 'work':
        return WORK_TIME;
      case 'break':
        return BREAK_TIME;
      case 'long-break':
        return LONG_BREAK_TIME;
    }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });

        if (mode === 'work') {
          setTotalFocusTime((prev) => {
            const newTotal = prev + 1;
            if (newTotal >= FOCUS_TIME_THRESHOLD && !showCognitiveAlert) {
              setShowCognitiveAlert(true);
            }
            return newTotal;
          });
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    // Notificação do navegador
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Completo!', {
        body: mode === 'work' ? 'Hora de fazer uma pausa!' : 'Hora de voltar ao trabalho!',
        icon: '⏰',
      });
    }

    if (mode === 'work') {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);
      
      if (newSessions % SESSIONS_UNTIL_LONG_BREAK === 0) {
        switchMode('long-break');
      } else {
        switchMode('break');
      }
    } else {
      switchMode('work');
      setShowCognitiveAlert(false);
    }
  };

  const switchMode = (newMode: PomodoroMode) => {
    setMode(newMode);
    const duration = getModeDuration(newMode);
    setTimeLeft(duration);
    totalTimeRef.current = duration;
  };

  const handleStartPause = () => {
    if (!isRunning && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    const duration = getModeDuration(mode);
    setTimeLeft(duration);
    totalTimeRef.current = duration;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const progress = ((totalTimeRef.current - timeLeft) / totalTimeRef.current) * 100;

  const getModeLabel = () => {
    switch (mode) {
      case 'work':
        return '🎯 Foco';
      case 'break':
        return '☕ Pausa Curta';
      case 'long-break':
        return '🌟 Pausa Longa';
    }
  };

  return (
    <div className={`pomodoro-timer pomodoro-timer--${mode}`}>
      <div className="pomodoro-timer__header">
        <div className="pomodoro-timer__mode">{getModeLabel()}</div>
        <div className="pomodoro-timer__time">{formatTime(timeLeft)}</div>
      </div>

      <div className="pomodoro-timer__progress">
        <div
          className="pomodoro-timer__progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="pomodoro-timer__controls">
        <button
          className="pomodoro-btn"
          onClick={handleStartPause}
        >
          {isRunning ? '⏸️ Pausar' : '▶️ Iniciar'}
        </button>
        <button
          className="pomodoro-btn pomodoro-btn--secondary"
          onClick={handleReset}
        >
          🔄 Reiniciar
        </button>
      </div>

      <div className="pomodoro-timer__stats">
        <div className="pomodoro-stat">
          <div className="pomodoro-stat__value">{sessionsCompleted}</div>
          <div className="pomodoro-stat__label">Sessões</div>
        </div>
        <div className="pomodoro-stat">
          <div className="pomodoro-stat__value">
            {formatTotalTime(totalFocusTime)}
          </div>
          <div className="pomodoro-stat__label">Foco Total</div>
        </div>
        <div className="pomodoro-stat">
          <div className="pomodoro-stat__value">
            {Math.ceil(sessionsCompleted / SESSIONS_UNTIL_LONG_BREAK)}
          </div>
          <div className="pomodoro-stat__label">Ciclos</div>
        </div>
      </div>

      {showCognitiveAlert && mode === 'work' && (
        <div className="pomodoro-timer__alert">
          <span className="pomodoro-timer__alert-icon">⚠️</span>
          <div>
            <strong>Alerta Cognitivo:</strong> Você está em foco há mais de 90 minutos.
            Considere fazer uma pausa mais longa para manter a produtividade!
          </div>
        </div>
      )}
    </div>
  );
}
