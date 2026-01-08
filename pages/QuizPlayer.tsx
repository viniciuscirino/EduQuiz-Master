
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../App';
import { Question } from '../types';

const QuizPlayer: React.FC = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { data, addResult, currentUser } = useQuiz();
  
  const quiz = data.quizzes.find(q => q.id === quizId);
  const quizQuestions = data.questions.filter(q => q.quizId === quizId);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isAnswering, setIsAnswering] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [shortAnswer, setShortAnswer] = useState('');
  const [orderingItems, setOrderingItems] = useState<string[]>([]);
  const [answerHistory, setAnswerHistory] = useState<any[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  
  const timerRef = useRef<number | null>(null);
  const currentQuestion = quizQuestions[currentIndex];

  useEffect(() => {
    if (currentQuestion) {
      if (currentQuestion.type === 'ordering') {
        // Shuffle for ordering
        setOrderingItems([...currentQuestion.options].sort(() => Math.random() - 0.5));
      }
      setShortAnswer('');
      setSelectedOption(null);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (currentQuestion && isAnswering) {
      setTimeLeft(currentQuestion.timeLimit);
      setStartTime(Date.now());
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAnswer(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentIndex, isAnswering, currentQuestion]);

  const handleAnswer = (answer: any) => {
    if (!isAnswering) return;
    if (timerRef.current) clearInterval(timerRef.current);
    
    setIsAnswering(false);
    let isCorrect = false;

    if (currentQuestion.type === 'multiple' || currentQuestion.type === 'boolean') {
      setSelectedOption(answer);
      isCorrect = answer === currentQuestion.correctAnswerIndex;
    } else if (currentQuestion.type === 'short_answer') {
      isCorrect = shortAnswer.trim().toLowerCase() === currentQuestion.correctAnswerText?.toLowerCase();
    } else if (currentQuestion.type === 'ordering') {
      // Simplificação: no ordering, a ordem correta no DB é 0,1,2,3
      isCorrect = JSON.stringify(orderingItems) === JSON.stringify(currentQuestion.options);
    }

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    setAnswerHistory(prev => [...prev, {
      question: currentQuestion,
      isCorrect,
      timeTaken: Math.round((Date.now() - startTime) / 1000)
    }]);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setIsAnswering(true);
    } else {
      const totalTime = answerHistory.reduce((sum, a) => sum + a.timeTaken, 0);
      const result = {
        userName: currentUser?.name || 'Anônimo',
        quizId: quizId!,
        themeId: quiz!.themeId,
        score,
        totalQuestions: quizQuestions.length,
        timeSpent: totalTime,
        averageResponseTime: Number((totalTime / quizQuestions.length).toFixed(2)),
      };
      addResult(result);
      navigate(`/result/${crypto.randomUUID()}`, { state: { result, answerHistory } });
    }
  };

  if (!quiz || quizQuestions.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center bg-white px-6 py-4 rounded-3xl shadow-sm">
        <div className="text-xl font-black text-blue-600">Questão {currentIndex + 1}/{quizQuestions.length}</div>
        <div className={`text-xl font-mono ${timeLeft < 5 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>⏱️ {timeLeft}s</div>
      </div>

      <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-gray-50 flex flex-col min-h-[400px]">
        <h2 className="text-3xl font-black text-gray-800 mb-10">{currentQuestion.text}</h2>

        <div className="space-y-4 flex-grow">
          {/* Múltipla Escolha e Booleano */}
          {(currentQuestion.type === 'multiple' || currentQuestion.type === 'boolean') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((opt, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={!isAnswering}
                  className={`p-6 rounded-3xl border-2 font-bold text-lg text-left transition-all ${
                    isAnswering ? 'border-gray-100 hover:border-blue-500 hover:bg-blue-50' :
                    idx === currentQuestion.correctAnswerIndex ? 'border-green-500 bg-green-50 text-green-700' :
                    idx === selectedOption ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-50 opacity-40'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Resposta Curta */}
          {currentQuestion.type === 'short_answer' && (
            <div className="space-y-4">
              <input 
                disabled={!isAnswering}
                value={shortAnswer}
                onChange={e => setShortAnswer(e.target.value)}
                placeholder="Digite sua resposta aqui..."
                className="w-full p-6 text-xl font-bold rounded-3xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none"
              />
              {isAnswering && (
                <button onClick={() => handleAnswer(shortAnswer)} className="w-full bg-blue-600 text-white py-4 rounded-3xl font-black">Enviar Resposta</button>
              )}
            </div>
          )}

          {/* Ordenação */}
          {currentQuestion.type === 'ordering' && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-400 italic mb-4">Clique nos itens para reordenar (Simulação de arraste):</p>
              {orderingItems.map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-2xl border flex items-center gap-4">
                  <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">{idx + 1}</span>
                  <span className="font-bold">{item}</span>
                </div>
              ))}
              {isAnswering && (
                 <p className="text-xs text-center text-gray-400 mt-4">Neste modo offline, verifique se a ordem está correta e confirme.</p>
              )}
              {isAnswering && (
                <button onClick={() => handleAnswer(orderingItems)} className="w-full bg-blue-600 text-white py-4 rounded-3xl font-black mt-4">Confirmar Ordem</button>
              )}
            </div>
          )}
        </div>

        {!isAnswering && (
          <div className="mt-10 animate-in slide-in-from-bottom-4">
             <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 mb-6">
                <h4 className="font-black text-blue-800">Explicação:</h4>
                <p className="text-blue-600 text-sm">{currentQuestion.explanation}</p>
                {currentQuestion.type === 'short_answer' && (
                  <p className="mt-2 text-xs font-bold">Resposta correta: {currentQuestion.correctAnswerText}</p>
                )}
             </div>
             <button onClick={nextQuestion} className="w-full bg-gray-800 text-white py-6 rounded-3xl font-black text-xl">Continuar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPlayer;
