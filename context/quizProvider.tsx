"use client";

import { Choice, Competition, Question } from "@/types";
import { NullCallback } from "@/utils";
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type QuestionWithChoices = Question & { choices: Choice[] };

export type QuizContextProps = {
  remainingPeople: number;
  quiz?: Competition;
  health: number;
  hint: number;
  question: QuestionWithChoices | null;
  scoresHistory: number[];
  answerQuestion: (answerIndex: number) => void;
  timer: number;
  stateIndex: number;
  activeQuestionChoiceIndex: number;
  isRestTime: boolean;
  setIsRestTime: (value: boolean) => void;
};

export const QuizContext = createContext<QuizContextProps>({
  health: -1,
  hint: -1,
  question: null,
  remainingPeople: -1,
  scoresHistory: [],
  answerQuestion: NullCallback,
  timer: 0,
  stateIndex: -1,
  activeQuestionChoiceIndex: -1,
  isRestTime: false,
  setIsRestTime: NullCallback,
});

const statePeriod = 10000;
const restPeriod = 5000;

export const useQuizContext = () => useContext(QuizContext);

const QuizContextProvider: FC<PropsWithChildren & { quiz: Competition }> = ({
  children,
  quiz,
}) => {
  const [health, setHealth] = useState(1);
  const [hint, setHint] = useState(1);
  const [remainingPeople, setRemainingPeople] = useState(1);
  const [scoresHistory, setScoresHistory] = useState<number[]>([]);
  const [question, setQuestion] = useState<QuestionWithChoices | null>(null);
  const [activeQuestionChoice, setActiveQuestionChoice] = useState<number>(-1);
  const [timer, setTimer] = useState(0);
  const [stateIndex, setStateIndex] = useState(-1);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(
    null,
  );
  const [isRestTime, setIsRestTime] = useState(false);

  const answerQuestion = (choiceIndex: number) => {
    setActiveQuestionChoice(choiceIndex);
  };

  const askForHint = () => {};

  const handleNextCallback = useCallback(() => {
    console.log("Handle Next Callback Has been Called");
    const startAt = new Date(quiz.startAt);
    const now = new Date();

    const totalPeriod = restPeriod + statePeriod;

    if (startAt > now) {
      setStateIndex(-1);
      setTimer(startAt.getTime() - now.getTime());
      return;
    }

    const timePassed = now.getTime() - startAt.getTime();

    const timeInCycle = timePassed % totalPeriod;

    setStateIndex(Math.floor(timePassed / (restPeriod + statePeriod)));

    if (timeInCycle >= 10000) {
      setTimer(totalPeriod - timeInCycle);
      setIsRestTime(true);
      // answer
      // fetch next question
      // .............
    } else {
      setTimer(statePeriod - timeInCycle);
      setIsRestTime(false);
    }
  }, [quiz]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          handleNextCallback();
          return 0;
        }

        return prev - 10;
      });
    }, 10);

    return () => {
      clearInterval(timerInterval);
    };
  }, [handleNextCallback]);

  return (
    <QuizContext.Provider
      value={{
        health,
        hint,
        question,
        remainingPeople,
        scoresHistory,
        quiz,
        answerQuestion,
        timer,
        stateIndex,
        activeQuestionChoiceIndex: activeQuestionChoice,
        isRestTime,
        setIsRestTime,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export default QuizContextProvider;
