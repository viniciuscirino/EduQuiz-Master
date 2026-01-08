
import React, { useState } from 'react';
import { useQuiz } from '../App';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

const Login: React.FC = () => {
  const { data, setData, login } = useQuiz();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'student' | 'admin'>('student');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Por favor, insira um nome válido.');
      return;
    }

    // Find existing user or create new one
    let user = data.users.find(u => u.name.toLowerCase() === name.toLowerCase() && u.role === 'user');
    
    if (!user) {
      user = {
        id: crypto.randomUUID(),
        name: name.trim(),
        role: 'user'
      };
      setData(prev => ({ ...prev, users: [...prev.users, user!] }));
    }

    login(user);
    navigate('/');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const admin = data.users.find(u => u.role === 'admin' && u.password === password);
    
    if (admin) {
      login(admin);
      navigate('/admin');
    } else {
      setError('Senha de administrador incorreta.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-in zoom-in duration-500">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden">
          <div className="p-10 text-center space-y-2">
            <div className="text-6xl mb-4">🎓</div>
            <h1 className="text-3xl font-black text-gray-800">EduQuiz Master</h1>
            <p className="text-gray-400 font-medium">Plataforma de Excelência Educacional</p>
          </div>

          <div className="flex bg-gray-100 p-1 mx-10 rounded-2xl">
            <button 
              onClick={() => { setMode('student'); setError(''); }}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
            >
              Estudante
            </button>
            <button 
              onClick={() => { setMode('admin'); setError(''); }}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
            >
              Admin
            </button>
          </div>

          <div className="p-10 pt-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 animate-in shake duration-300">
                ⚠️ {error}
              </div>
            )}

            {mode === 'student' ? (
              <form onSubmit={handleStudentLogin} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Como devemos te chamar?</label>
                  <input 
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:border-blue-500 focus:outline-none transition-all font-bold text-gray-700"
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all transform active:scale-95">
                  Começar a Aprender
                </button>
              </form>
            ) : (
              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Acesso Restrito</label>
                  <input 
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha Administrativa"
                    className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:border-blue-500 focus:outline-none transition-all font-bold text-gray-700"
                  />
                </div>
                <button type="submit" className="w-full bg-gray-800 text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-900 shadow-xl transition-all transform active:scale-95">
                  Acessar Painel
                </button>
                <p className="text-center text-xs text-gray-400">Padrao: admin</p>
              </form>
            )}
          </div>
        </div>
        <p className="text-center mt-8 text-white/40 text-sm font-medium">© 2024 EduQuiz - Servidor Local Offline Ativo</p>
      </div>
    </div>
  );
};

export default Login;
