
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { AppData, Theme, Quiz, Question, UserResult, User } from './types';
import { getStorageData, saveStorageData } from './storage';
import Home from './pages/Home';
import QuizList from './pages/QuizList';
import QuizPlayer from './pages/QuizPlayer';
import ResultSummary from './pages/ResultSummary';
import Rankings from './pages/Rankings';
import Admin from './pages/Admin';
import Login from './pages/Login';

interface QuizContextType {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  addResult: (result: Omit<UserResult, 'id' | 'date'>) => void;
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within QuizProvider');
  return context;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useQuiz();
  const location = useLocation();

  if (!currentUser && location.pathname !== '/login') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-black flex items-center gap-2">
            <span className="text-3xl">🎓</span> 
            <span className="hidden sm:inline">EduQuiz Master</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 font-bold">
            <Link to="/" className="hover:text-blue-200 transition">Início</Link>
            <Link to="/rankings" className="hover:text-blue-200 transition">Rankings</Link>
            {currentUser?.role === 'admin' && (
              <Link to="/admin" className="bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition">⚙️ Painel</Link>
            )}
            <div className="flex items-center gap-4 pl-4 border-l border-white/20">
              <span className="text-sm opacity-80">{currentUser?.name}</span>
              <button onClick={logout} className="text-xs bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition uppercase tracking-tighter">Sair</button>
            </div>
          </div>

          <button 
            className="md:hidden p-2 hover:bg-blue-700 rounded-lg text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden bg-blue-700 p-6 flex flex-col gap-6 animate-in slide-in-from-top font-bold shadow-2xl">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Início</Link>
            <Link to="/rankings" onClick={() => setIsMenuOpen(false)}>Rankings</Link>
            {currentUser?.role === 'admin' && (
              <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Administração</Link>
            )}
            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-sm">{currentUser?.name}</span>
              <button onClick={logout} className="bg-red-500 px-4 py-2 rounded-xl">Sair</button>
            </div>
          </div>
        )}
      </nav>
      <main className="flex-grow max-w-6xl mx-auto w-full p-4 md:p-8">
        {children}
      </main>
      <footer className="bg-gray-200 py-10 text-center text-gray-500 text-sm mt-12 border-t border-gray-300">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-2 font-black text-gray-400 text-lg">EduQuiz Master 2.5</div>
          <div className="font-bold">© 2026 - Sistema Educacional Profissional Offline</div>
          <div className="mt-1 text-blue-500 font-bold">Direitos Reservados a ViniTec</div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  const [data, setData] = useState<AppData>(getStorageData());
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('eduquiz_auth_v2');
    return saved ? JSON.parse(saved) : null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    saveStorageData(data);
    // Sync current user if data changes (e.g., admin profile update)
    if (currentUser) {
      const updatedUser = data.users.find(u => u.id === currentUser.id);
      if (updatedUser && (updatedUser.name !== currentUser.name || updatedUser.password !== currentUser.password)) {
        setCurrentUser(updatedUser);
        localStorage.setItem('eduquiz_auth_v2', JSON.stringify(updatedUser));
      }
    }
  }, [data]);

  const login = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('eduquiz_auth_v2', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eduquiz_auth_v2');
    navigate('/login');
  };

  const addResult = (res: Omit<UserResult, 'id' | 'date'>) => {
    const newResult: UserResult = {
      ...res,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      results: [...prev.results, newResult]
    }));
  };

  return (
    <QuizContext.Provider value={{ data, setData, addResult, currentUser, login, logout }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/theme/:themeId" element={<QuizList />} />
              <Route path="/quiz/:quizId" element={<QuizPlayer />} />
              <Route path="/result/:resultId" element={<ResultSummary />} />
              <Route path="/rankings" element={<Rankings />} />
              <Route path="/admin/*" element={
                currentUser?.role === 'admin' ? <Admin /> : <Navigate to="/" />
              } />
            </Routes>
          </Layout>
        } />
      </Routes>
    </QuizContext.Provider>
  );
}
