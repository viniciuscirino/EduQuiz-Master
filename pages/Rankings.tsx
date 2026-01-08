
import React, { useState } from 'react';
import { useQuiz } from '../App';

const Rankings: React.FC = () => {
  const { data } = useQuiz();
  const [filter, setFilter] = useState<'global' | 'theme' | 'quiz'>('global');
  const [selectedThemeId, setSelectedThemeId] = useState<string>('');
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');

  const filteredResults = useMemo(() => {
    let results = [...data.results];
    
    if (filter === 'theme' && selectedThemeId) {
      results = results.filter(r => r.themeId === selectedThemeId);
    } else if (filter === 'quiz' && selectedQuizId) {
      results = results.filter(r => r.quizId === selectedQuizId);
    }

    // Sort by score desc, then time spent asc
    return results.sort((a, b) => {
      const scoreDiff = (b.score / b.totalQuestions) - (a.score / a.totalQuestions);
      if (scoreDiff !== 0) return scoreDiff;
      return a.averageResponseTime - b.averageResponseTime;
    });
  }, [data.results, filter, selectedThemeId, selectedQuizId]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-extrabold text-gray-800">🏆 Quadro de Honra</h1>
        <div className="flex gap-2 p-1 bg-gray-200 rounded-xl">
          <button 
            onClick={() => setFilter('global')}
            className={`px-4 py-2 rounded-lg font-bold transition ${filter === 'global' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Global
          </button>
          <button 
            onClick={() => setFilter('theme')}
            className={`px-4 py-2 rounded-lg font-bold transition ${filter === 'theme' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Tema
          </button>
          <button 
            onClick={() => setFilter('quiz')}
            className={`px-4 py-2 rounded-lg font-bold transition ${filter === 'quiz' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Quiz
          </button>
        </div>
      </header>

      {/* Filters */}
      {(filter === 'theme' || filter === 'quiz') && (
        <div className="flex flex-wrap gap-4 bg-white p-4 rounded-2xl shadow-sm animate-in slide-in-from-top-2">
          {filter === 'theme' && (
            <select 
              className="border p-2 rounded-lg focus:outline-blue-500"
              value={selectedThemeId}
              onChange={(e) => setSelectedThemeId(e.target.value)}
            >
              <option value="">Selecione um Tema</option>
              {data.themes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          )}
          {filter === 'quiz' && (
            <select 
              className="border p-2 rounded-lg focus:outline-blue-500"
              value={selectedQuizId}
              onChange={(e) => setSelectedQuizId(e.target.value)}
            >
              <option value="">Selecione um Quiz</option>
              {data.quizzes.map(q => <option key={q.id} value={q.id}>{q.title}</option>)}
            </select>
          )}
        </div>
      )}

      {/* Results Table */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 font-bold">Pos</th>
                <th className="px-6 py-4 font-bold">Estudante</th>
                <th className="px-6 py-4 font-bold">Aproveitamento</th>
                <th className="px-6 py-4 font-bold">Tempo Médio</th>
                <th className="px-6 py-4 font-bold">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredResults.length > 0 ? (
                filteredResults.map((res, index) => (
                  <tr key={res.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">{res.userName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-600">
                          {Math.round((res.score / res.totalQuestions) * 100)}%
                        </span>
                        <span className="text-xs text-gray-400">({res.score}/{res.totalQuestions})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-amber-600">{res.averageResponseTime}s</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(res.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                    Nenhum resultado encontrado para estes critérios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Internal imports to solve scope
import { useMemo } from 'react';

export default Rankings;
