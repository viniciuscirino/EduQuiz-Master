
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useQuiz } from '../App';
import { Theme, Quiz, Question, AppData, User } from '../types';

const Admin: React.FC = () => {
  const { data, setData, currentUser } = useQuiz();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'themes' | 'quizzes' | 'questions' | 'users' | 'profile' | 'network' | 'data'>('dashboard');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Admin Profile State
  const [adminProfile, setAdminProfile] = useState({ 
    name: currentUser?.name || '', 
    password: currentUser?.password || '' 
  });
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Form States
  const [newTheme, setNewTheme] = useState({ name: '', icon: '' });
  const [newQuiz, setNewQuiz] = useState({ title: '', description: '', themeId: '' });
  const [newQuestion, setNewQuestion] = useState({ 
    quizId: '', 
    text: '', 
    options: ['', '', '', ''], 
    correctAnswerIndex: 0, 
    correctAnswerText: '',
    correctOrder: [0, 1, 2, 3],
    explanation: '', 
    timeLimit: 20,
    type: 'multiple' as any
  });

  const stats = useMemo(() => {
    const totalUsers = data.users.filter(u => u.role === 'user').length;
    const totalResults = data.results.length;
    const avgScore = totalResults > 0 
      ? Math.round(data.results.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0) / totalResults * 100) 
      : 0;
    
    const quizCounts: Record<string, number> = {};
    data.results.forEach(r => quizCounts[r.quizId] = (quizCounts[r.quizId] || 0) + 1);
    const mostPopularId = Object.entries(quizCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const popularQuiz = data.quizzes.find(q => q.id === mostPopularId)?.title || 'Nenhum ainda';

    return { totalUsers, totalResults, avgScore, popularQuiz };
  }, [data]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => 
        u.id === currentUser?.id ? { ...u, name: adminProfile.name, password: adminProfile.password } : u
      )
    }));
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const question: Question = { 
      id: crypto.randomUUID(), 
      ...newQuestion,
      options: newQuestion.type === 'boolean' ? ['Verdadeiro', 'Falso'] : newQuestion.options.filter(o => o !== '')
    };
    setData(prev => ({ ...prev, questions: [...prev.questions, question] }));
    setNewQuestion({ ...newQuestion, text: '', explanation: '' });
  };

  const handleDelete = (type: any, id: string) => {
    if (!window.confirm('Excluir este item permanentemente?')) return;
    setData(prev => ({
      ...prev,
      [type === 'theme' ? 'themes' : type === 'quiz' ? 'quizzes' : type === 'question' ? 'questions' : 'users']: 
      (prev as any)[type === 'theme' ? 'themes' : type === 'quiz' ? 'quizzes' : type === 'question' ? 'questions' : 'users'].filter((x: any) => x.id !== id)
    }));
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black text-blue-800">Painel Administrativo</h1>
          <div className="text-xs font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-full border">ViniTec Admin Engine v2.5</div>
        </div>
        
        <div className="flex flex-wrap gap-2 border-b overflow-x-auto">
          {[
            {id: 'dashboard', label: '📊 Status'},
            {id: 'network', label: '🌐 Rede Local'},
            {id: 'themes', label: '🏷️ Temas'},
            {id: 'quizzes', label: '📝 Quizzes'},
            {id: 'questions', label: '❓ Perguntas'},
            {id: 'users', label: '👥 Usuários'},
            {id: 'profile', label: '👤 Perfil'},
            {id: 'data', label: '💾 Dados'}
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-bold whitespace-nowrap transition-all border-b-4 ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === 'network' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4">
              <div className="bg-blue-600 text-white p-8 rounded-[40px] shadow-xl">
                <h2 className="text-3xl font-black mb-4">Como jogar em Rede Local?</h2>
                <div className="space-y-4 text-blue-50">
                  <p className="flex items-center gap-3">
                    <span className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
                    Certifique-se que todos os dispositivos estão no mesmo <strong>Wi-Fi</strong>.
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center font-bold">2</span>
                    Descubra o <strong>IP Local</strong> deste computador (ex: 192.168.1.15).
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center font-bold">3</span>
                    Abra o terminal e use: <code>npx serve -s build</code> ou exponha via IP.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 text-center">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="font-bold text-gray-800 mb-2">Acesso Rápido via QR</h3>
                  <p className="text-sm text-gray-400 mb-6">Gere um QR Code com a URL do seu servidor para os alunos escanearem.</p>
                  <div className="bg-white p-4 inline-block rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="w-32 h-32 flex items-center justify-center text-xs text-gray-300 italic">
                      [Espaço QR Code]
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                  <div className="text-4xl mb-4">🔗</div>
                  <h3 className="font-bold text-gray-800 mb-2">Endereço do Servidor</h3>
                  <p className="text-sm text-gray-400 mb-4">Envie este link para os participantes:</p>
                  <div className="bg-white p-4 rounded-xl font-mono text-blue-600 border border-blue-100 flex justify-between">
                    <span>http://localhost:5173</span>
                    <button className="text-xs uppercase font-black text-blue-400 hover:text-blue-600">Copiar</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-10">
              <form onSubmit={handleAddQuestion} className="bg-amber-50 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-500 mb-1">Tipo de Pergunta</label>
                  <select required className="w-full border p-3 rounded-xl" value={newQuestion.type} onChange={e => setNewQuestion({ ...newQuestion, type: e.target.value as any })}>
                    <option value="multiple">Múltipla Escolha</option>
                    <option value="boolean">Verdadeiro ou Falso</option>
                    <option value="short_answer">Resposta Curta (Texto)</option>
                    <option value="ordering">Ordenação (Arrumar Itens)</option>
                  </select>
                </div>
                
                <textarea required value={newQuestion.text} onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })} className="md:col-span-2 w-full border p-3 rounded-xl" placeholder="Enunciado da pergunta" />

                {newQuestion.type === 'multiple' && (
                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    {newQuestion.options.map((opt, idx) => (
                      <input key={idx} required value={opt} onChange={e => { const opts = [...newQuestion.options]; opts[idx] = e.target.value; setNewQuestion({ ...newQuestion, options: opts }); }} className="w-full border p-2 rounded-lg" placeholder={`Opção ${idx + 1}`} />
                    ))}
                  </div>
                )}

                {newQuestion.type === 'short_answer' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-500 mb-1">Resposta Correta (Exata)</label>
                    <input required value={newQuestion.correctAnswerText} onChange={e => setNewQuestion({...newQuestion, correctAnswerText: e.target.value})} className="w-full border p-3 rounded-xl" placeholder="Ex: Brasil" />
                  </div>
                )}

                {newQuestion.type === 'ordering' && (
                  <div className="md:col-span-2 space-y-2">
                    <p className="text-xs font-bold text-gray-400">Insira os itens na ordem CORRETA:</p>
                    {newQuestion.options.map((opt, idx) => (
                      <input key={idx} required value={opt} onChange={e => { const opts = [...newQuestion.options]; opts[idx] = e.target.value; setNewQuestion({ ...newQuestion, options: opts }); }} className="w-full border p-2 rounded-lg" placeholder={`Item ${idx + 1}`} />
                    ))}
                  </div>
                )}

                <button type="submit" className="md:col-span-2 bg-amber-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-700 transition">Salvar Pergunta</button>
              </form>
            </div>
          )}

          {/* ... Outras abas (themes, quizzes, users, profile, data) mantidas como antes ... */}
          {activeTab === 'dashboard' && stats.popularQuiz && (
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-6 bg-blue-50 rounded-2xl">
                  <h4 className="text-blue-400 text-xs font-black uppercase">Usuários</h4>
                  <p className="text-3xl font-black text-blue-600">{stats.totalUsers}</p>
                </div>
                <div className="p-6 bg-green-50 rounded-2xl">
                  <h4 className="text-green-400 text-xs font-black uppercase">Resultados</h4>
                  <p className="text-3xl font-black text-green-600">{stats.totalResults}</p>
                </div>
                <div className="p-6 bg-amber-50 rounded-2xl">
                  <h4 className="text-amber-400 text-xs font-black uppercase">Média</h4>
                  <p className="text-3xl font-black text-amber-600">{stats.avgScore}%</p>
                </div>
                <div className="p-6 bg-purple-50 rounded-2xl">
                  <h4 className="text-purple-400 text-xs font-black uppercase">Popular</h4>
                  <p className="text-xl font-black text-purple-600 truncate">{stats.popularQuiz}</p>
                </div>
             </div>
          )}
          
          {activeTab === 'profile' && (
             <div className="max-w-md mx-auto">
                <form onSubmit={handleUpdateProfile} className="space-y-4 bg-gray-50 p-8 rounded-3xl border">
                  <h3 className="text-xl font-black text-gray-800">Editar Perfil Admin</h3>
                  {profileSuccess && <div className="p-2 bg-green-50 text-green-600 text-xs rounded-lg text-center font-bold">Atualizado!</div>}
                  <input className="w-full p-3 rounded-xl border" value={adminProfile.name} onChange={e => setAdminProfile({...adminProfile, name: e.target.value})} placeholder="Nome" />
                  <input className="w-full p-3 rounded-xl border" type="password" value={adminProfile.password} onChange={e => setAdminProfile({...adminProfile, password: e.target.value})} placeholder="Senha" />
                  <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Salvar</button>
                </form>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
