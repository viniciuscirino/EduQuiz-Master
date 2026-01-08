
import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useQuiz } from '../App';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ResultSummary: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showReview, setShowReview] = useState(false);

  const result = state?.result;
  const answerHistory = state?.answerHistory || [];

  if (!result) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Resultado expirado</h2>
        <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold">Voltar ao Início</Link>
      </div>
    );
  }

  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  const pieData = [
    { name: 'Acertos', value: result.score },
    { name: 'Erros', value: result.totalQuestions - result.score },
  ];
  const COLORS_CHART = ['#22c55e', '#f87171'];

  const getEncouragement = () => {
    if (percentage === 100) return { title: "Perfeito! 🏆", msg: "Você demonstrou domínio absoluto sobre este tema!" };
    if (percentage >= 80) return { title: "Incrível! 🌟", msg: "Seu desempenho foi fantástico. Quase lá!" };
    if (percentage >= 50) return { title: "Muito bem! 👍", msg: "Você tem uma boa base, continue praticando." };
    return { title: "Persista! 💪", msg: "Cada erro é uma oportunidade de aprendizado. Tente de novo!" };
  };

  const encouragement = getEncouragement();

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header Result */}
      <section className="bg-white rounded-[48px] p-10 md:p-16 shadow-2xl text-center space-y-8 border border-blue-50">
        {percentage === 100 && <div className="text-6xl animate-bounce">🎊</div>}
        <div>
          <h1 className="text-5xl font-black text-gray-800 mb-2">{encouragement.title}</h1>
          <p className="text-xl text-gray-400 font-medium">{encouragement.msg}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-blue-50 p-8 rounded-[32px] transform transition hover:scale-105">
            <p className="text-xs font-black text-blue-300 uppercase tracking-widest mb-2">Pontuação</p>
            <p className="text-5xl font-black text-blue-600">{result.score}<span className="text-2xl text-blue-300">/{result.totalQuestions}</span></p>
          </div>
          <div className="bg-green-50 p-8 rounded-[32px] transform transition hover:scale-105">
            <p className="text-xs font-black text-green-300 uppercase tracking-widest mb-2">Desempenho</p>
            <p className="text-5xl font-black text-green-600">{percentage}%</p>
          </div>
          <div className="bg-amber-50 p-8 rounded-[32px] transform transition hover:scale-105">
            <p className="text-xs font-black text-amber-300 uppercase tracking-widest mb-2">Tempo Médio</p>
            <p className="text-5xl font-black text-amber-600">{result.averageResponseTime}s</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Gráfico */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-xl border border-gray-50 flex flex-col items-center justify-center">
          <h3 className="text-xl font-black text-gray-700 mb-6">Equilíbrio de Respostas</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_CHART[index]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span> <span className="text-sm font-bold text-gray-500">Acertos</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-400 rounded-full"></span> <span className="text-sm font-bold text-gray-500">Erros</span></div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="lg:col-span-3 flex flex-col justify-center space-y-4">
          <button 
            onClick={() => setShowReview(!showReview)}
            className="w-full bg-blue-100 text-blue-700 py-6 rounded-[32px] font-black text-xl hover:bg-blue-200 transition shadow-lg"
          >
            {showReview ? 'Ocultar Revisão' : '👀 Revisar Questões'}
          </button>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => navigate('/')} className="bg-gray-800 text-white py-6 rounded-[32px] font-black hover:bg-gray-900 transition shadow-lg">Início</button>
            <button onClick={() => navigate('/rankings')} className="bg-white border-2 border-gray-100 text-gray-800 py-6 rounded-[32px] font-black hover:bg-gray-50 transition shadow-sm">Rankings</button>
          </div>
        </div>
      </div>

      {/* Review Section */}
      {showReview && (
        <section className="space-y-6 animate-in slide-in-from-top-10 duration-500">
          <h2 className="text-3xl font-black text-gray-800 px-4">Análise Detalhada</h2>
          <div className="space-y-4">
            {answerHistory.map((item: any, idx: number) => (
              <div key={idx} className={`bg-white p-8 rounded-[32px] border-l-8 shadow-sm ${item.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest ${item.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {item.isCorrect ? 'Correta' : 'Incorreta'}
                  </span>
                  <span className="text-xs font-bold text-gray-400">Tempo: {item.timeTaken}s</span>
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-6">{item.question.text}</h4>
                <div className="space-y-2">
                  <div className={`p-4 rounded-2xl text-sm font-medium ${item.isCorrect ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    Sua resposta: {item.selected === -1 ? 'Tempo Expirado' : item.question.options[item.selected]}
                  </div>
                  {!item.isCorrect && (
                    <div className="p-4 rounded-2xl text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      Resposta correta: {item.question.options[item.question.correctAnswerIndex]}
                    </div>
                  )}
                  <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-4 rounded-xl italic">
                    <strong>Explicação:</strong> {item.question.explanation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ResultSummary;
