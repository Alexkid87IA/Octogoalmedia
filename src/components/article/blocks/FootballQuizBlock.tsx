// src/components/article/blocks/FootballQuizBlock.tsx
// Quiz interactif football avec timer et score

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Share2, Trophy, ChevronRight, RotateCcw } from 'lucide-react';
import { urlFor } from '../../../utils/sanityClient';
import { SanityImage } from '../../../types/sanity';

interface FootballQuizProps {
  value: {
    title: string;
    description?: string;
    quizType: 'guess_player' | 'trivia' | 'guess_club' | 'guess_year' | 'stats';
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    timeLimit: number;
    questions: Question[];
    showResults: boolean;
    shareEnabled: boolean;
    resultMessages: {
      perfect: string;
      good: string;
      average: string;
      low: string;
    };
  };
}

interface Question {
  _key: string;
  question: string;
  image?: SanityImage;
  imageUrl?: string;
  answers: Answer[];
  explanation?: string;
  points: number;
}

interface Answer {
  _key: string;
  text: string;
  isCorrect: boolean;
}

const DIFFICULTY_COLORS = {
  easy: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  hard: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  expert: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
};

const DIFFICULTY_LABELS = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
  expert: 'Expert',
};

const FootballQuizBlock: React.FC<FootballQuizProps> = ({ value }) => {
  // Valeurs par défaut
  const title = value?.title || 'Quiz Football';
  const description = value?.description;
  const difficulty = value?.difficulty || 'medium';
  const timeLimit = value?.timeLimit || 30;
  const questions = value?.questions || [];
  const showResults = value?.showResults !== false;
  const shareEnabled = value?.shareEnabled !== false;
  const resultMessages = value?.resultMessages;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  // Protection: pas de données ou pas de questions
  if (!value || !questions || questions.length === 0) {
    return (
      <div className="my-10 md:my-14">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden p-6 text-center">
          <span className="text-4xl mb-4 block">🎯</span>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400">Quiz en cours de préparation...</p>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-4 text-xs text-left text-gray-500 overflow-auto max-h-40 bg-gray-900 p-2 rounded">
              {JSON.stringify(value, null, 2)}
            </pre>
          )}
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const totalPoints = questions.reduce((acc, q) => acc + (q.points || 1), 0);
  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

  // Timer
  useEffect(() => {
    if (!quizStarted || quizComplete) return;
    if (timeLimit > 0 && !answered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && !answered) {
      handleAnswer(null);
    }
  }, [timeLeft, answered, quizStarted, quizComplete, timeLimit]);

  // Reset timer on new question
  useEffect(() => {
    if (timeLimit > 0) {
      setTimeLeft(timeLimit);
    }
  }, [currentQuestion, timeLimit]);

  const handleAnswer = useCallback((answerKey: string | null) => {
    if (answered) return;
    setAnswered(true);
    setSelectedAnswer(answerKey);

    const correctAnswer = question.answers.find((a) => a.isCorrect);
    if (answerKey && correctAnswer && answerKey === correctAnswer._key) {
      setScore((s) => s + question.points);
    }
  }, [answered, question]);

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((c) => c + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setTimeLeft(timeLimit);
    setQuizComplete(false);
    setQuizStarted(false);
  };

  const getResultMessage = () => {
    if (percentage === 100) return resultMessages?.perfect || 'Parfait !';
    if (percentage >= 70) return resultMessages?.good || 'Bien joué !';
    if (percentage >= 40) return resultMessages?.average || 'Pas mal !';
    return resultMessages?.low || 'Tu feras mieux la prochaine fois !';
  };

  const shareResult = () => {
    const text = `J'ai obtenu ${score}/${totalPoints} (${percentage}%) au quiz "${title}" sur Octogoal !`;
    if (navigator.share) {
      navigator.share({ title, text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text + ' ' + window.location.href);
    }
  };

  const diffColors = DIFFICULTY_COLORS[difficulty] || DIFFICULTY_COLORS.medium;

  // Start screen
  if (!quizStarted) {
    return (
      <div className="my-10 md:my-14">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 md:p-8 text-center">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 ${diffColors.bg} ${diffColors.text}`}>
              {DIFFICULTY_LABELS[difficulty]}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{title}</h3>
            {description && <p className="text-gray-400 mb-6">{description}</p>}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-8">
              <span>{questions.length} questions</span>
              {timeLimit > 0 && (
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {timeLimit}s par question
                </span>
              )}
              <span>{totalPoints} points max</span>
            </div>
            <button
              onClick={() => setQuizStarted(true)}
              className="px-8 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition-colors"
            >
              Commencer le quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (quizComplete && showResults) {
    return (
      <div className="my-10 md:my-14">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 md:p-8 text-center">
            <Trophy size={48} className="mx-auto mb-4 text-yellow-400" />
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Quiz terminé !</h3>
            <p className="text-xl text-gray-300 mb-4">{getResultMessage()}</p>
            <div className="text-5xl font-black text-pink-500 mb-2">
              {score}/{totalPoints}
            </div>
            <div className="text-gray-400 mb-8">{percentage}% de bonnes réponses</div>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={restartQuiz}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
              >
                <RotateCcw size={18} />
                Recommencer
              </button>
              {shareEnabled && (
                <button
                  onClick={shareResult}
                  className="flex items-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-medium rounded-xl transition-colors"
                >
                  <Share2 size={18} />
                  Partager
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Question screen
  return (
    <div className="my-10 md:my-14">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">
              Question {currentQuestion + 1}/{questions.length}
            </span>
            <div className={`px-2 py-0.5 rounded text-xs font-medium ${diffColors.bg} ${diffColors.text}`}>
              {question.points} pts
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-pink-400 font-medium">Score: {score}</span>
            {timeLimit > 0 && (
              <div className={`flex items-center gap-1 text-sm font-medium ${timeLeft <= 5 ? 'text-red-400' : 'text-gray-400'}`}>
                <Clock size={14} />
                {timeLeft}s
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-800">
          <motion.div
            className="h-full bg-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + (answered ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="p-6 md:p-8">
          {/* Image */}
          {(question.image || question.imageUrl) && (
            <div className="mb-6 flex justify-center">
              <img
                src={question.image ? urlFor(question.image).width(400).url() : question.imageUrl}
                alt=""
                className="max-h-48 rounded-lg object-contain"
              />
            </div>
          )}

          <h4 className="text-xl md:text-2xl font-bold text-white text-center mb-8">
            {question.question}
          </h4>

          {/* Answers */}
          <div className="grid gap-3">
            <AnimatePresence mode="wait">
              {question.answers.map((answer, index) => {
                const isSelected = selectedAnswer === answer._key;
                const isCorrect = answer.isCorrect;
                const showCorrect = answered && isCorrect;
                const showWrong = answered && isSelected && !isCorrect;

                return (
                  <motion.button
                    key={answer._key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAnswer(answer._key)}
                    disabled={answered}
                    className={`w-full p-4 rounded-xl text-left font-medium transition-all flex items-center gap-3 ${
                      showCorrect
                        ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                        : showWrong
                        ? 'bg-red-500/20 border-2 border-red-500 text-red-400'
                        : isSelected
                        ? 'bg-pink-500/20 border-2 border-pink-500 text-white'
                        : 'bg-gray-800 border-2 border-gray-700 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{answer.text}</span>
                    {showCorrect && <CheckCircle size={20} className="text-green-400" />}
                    {showWrong && <XCircle size={20} className="text-red-400" />}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Explanation */}
          {answered && question.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700"
            >
              <p className="text-sm text-gray-300">{question.explanation}</p>
            </motion.div>
          )}

          {/* Next button */}
          {answered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 flex justify-center"
            >
              <button
                onClick={nextQuestion}
                className="flex items-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition-colors"
              >
                {currentQuestion < questions.length - 1 ? 'Question suivante' : 'Voir les résultats'}
                <ChevronRight size={18} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FootballQuizBlock;
