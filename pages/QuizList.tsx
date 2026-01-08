
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuiz } from '../App';

const QuizList: React.FC = () => {
  const { themeId } = useParams();
  const { data } = useQuiz();
  
  const theme = data.themes.find(t => t.id === themeId);
  const themeQuizzes = data.quizzes.filter(q => q.themeId === themeId);

  if (!theme) return <div className="text-center py-20 text-xl font-bold">Tema não encontrado.</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-blue-600 hover:underline">← Voltar</Link>
        <h1 className="text-3xl font-extrabold text-gray-800">
          {theme.icon} Quizzes de {theme.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {themeQuizzes.length > 0 ? (
          themeQuizzes.map(quiz => {
            const questionCount = data.questions.filter(q => q.quizId === quiz.id).length;
            return (
              <div key={quiz.id} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
                <p className="text-gray-600 flex-grow mb-4">{quiz.description}</p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <span className="text-sm font-medium text-blue-500">
                    {questionCount} Pergunta{questionCount !== 1 ? 's' : ''}
                  </span>
                  <Link 
                    to={`/quiz/${quiz.id}`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 shadow-md hover:shadow-lg transition transform hover:scale-105"
                  >
                    Começar
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl shadow-inner text-gray-500 italic">
            Nenhum quiz cadastrado para este tema ainda.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;
