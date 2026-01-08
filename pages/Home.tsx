
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuiz } from '../App';

const Home: React.FC = () => {
  const { data, currentUser } = useQuiz();

  const userStats = useMemo(() => {
    if (!currentUser) return { totalQuizzes: 0, avgScore: 0 };
    const myResults = data.results.filter(r => r.userName === currentUser.name);
    const totalQuizzes = myResults.length;
    const avgScore = totalQuizzes > 0 
      ? Math.round(myResults.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0) / totalQuizzes * 100) 
      : 0;
    return { totalQuizzes, avgScore };
  }, [data.results, currentUser]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl shadow-xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left space-y-4 max-w-xl">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Aprimore seu conhecimento hoje!
            </h1>
            <p className="text-blue-100 text-lg opacity-90 font-medium">
              Explore temas diversos e desafie-se com quizzes criados para impulsionar seu aprendizado.
            </p>
            
            <div className="pt-4">
              <span className="text-2xl font-bold bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/10">
                👋 Olá, {currentUser?.name}!
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl border border-white/10 text-center w-32 shadow-2xl">
              <div className="text-3xl font-black mb-1">{userStats.totalQuizzes}</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-blue-200">Quizzes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl border border-white/10 text-center w-32 shadow-2xl">
              <div className="text-3xl font-black mb-1">{userStats.avgScore}%</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-blue-200">Média</div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl"></div>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-blue-600 w-2 h-8 rounded-full"></span>
            Categorias de Estudo
          </h2>
          {data.themes.length > 0 && (
            <span className="text-sm font-bold text-gray-400">{data.themes.length} temas carregados</span>
          )}
        </div>

        {data.themes.length === 0 ? (
          <div className="bg-white rounded-[40px] p-16 text-center border-2 border-dashed border-gray-100 space-y-6">
            <div className="text-7xl animate-pulse">📥</div>
            <div>
              <h3 className="text-2xl font-black text-gray-700">Nenhum conteúdo disponível</h3>
              <p className="text-gray-400 mt-2 max-w-sm mx-auto font-medium">Peça ao administrador para carregar os quizzes para você começar!</p>
            </div>
            {currentUser?.role === 'admin' && (
              <Link to="/admin" className="inline-block bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                Configurar Sistema
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.themes.map((theme) => {
              const quizCount = data.quizzes.filter(q => q.themeId === theme.id).length;
              return (
                <Link 
                  key={theme.id} 
                  to={`/theme/${theme.id}`}
                  className="group bg-white rounded-[32px] p-8 shadow-sm hover:shadow-2xl transition-all border border-transparent hover:border-blue-100 flex flex-col items-center text-center transform hover:-translate-y-2"
                >
                  <div className="text-6xl mb-6 p-6 bg-gray-50 rounded-[28px] group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-500">
                    {theme.icon}
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 group-hover:text-blue-600 transition-colors">
                    {theme.name}
                  </h3>
                  <p className="text-gray-400 mt-2 font-bold uppercase text-[10px] tracking-widest">
                    {quizCount} {quizCount === 1 ? 'Quiz' : 'Quizzes'} Disponível
                  </p>
                  <div className="mt-6 flex items-center text-blue-600 font-bold gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    Bora jogar <span className="text-xl">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
