import React, { useEffect, useState } from "react";
import QuestionCard from "../../components/QuestionCard";
import { IconButton } from "@mui/material";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import { Challenger } from "../../../types/challenger";
import {
  useAnswerQuestionMutation,
  useChallengerQuery,
} from "../../../redux/api";
import { useParams } from "react-router-dom";
import { errorType, snackbarPropsType } from "../../../types/misc";
import CustomizedSnackbar from "../../components/CustomizedSnackbar";
import { getError } from "../../../utils/functions";

const Questions = () => {
  const { id } = useParams();
  const [challengerData, setChallengerData] = useState<Challenger>();
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: number;
  }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [snackbarProps, setSnackbarProps] = useState<snackbarPropsType>();

  const challenger = useChallengerQuery(id || "");

  useEffect(() => {
    if (challenger.data) setChallengerData(challenger.data);
  }, [challenger]);

  const questions = challengerData?.questions;
  const currentQuestion = questions && questions[currentQuestionIndex];

  const totalQuestions = questions?.length;

  const [answerQuestionCall, { isLoading: submitting }] =
    useAnswerQuestionMutation();

  const handleSelectAnswer = (optionIndex: number) => {
    if (currentQuestion)
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion._id]: optionIndex,
      });
  };

  const handleSubmitAnswer = async () => {
    try {
      const data = {
        challengerName: challengerData?.name,
        adminUsername: challengerData?.adminUsername,
        questionId: currentQuestion?._id,
        userAnswer: currentQuestion && selectedAnswers[currentQuestion._id],
      };
      const res = await answerQuestionCall(data);
      if (res.error)
        return setSnackbarProps({
          isOpen: true,
          setOwn: setSnackbarProps,
          content: `Risposta non inviata: ${getError(res.error as errorType)}`,
          severity: "error",
        });
      setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Rsiposta inviata",
        severity: "success",
      });
    } catch (error) {
      setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Errore nell'invio",
        severity: "error",
      });
    }
  };

  return (
    <div className="w-11/12 mx-auto flex flex-col h-full justify-start gap-4">
      <div className="flex items-center bg-white p-2 rounded-lg shadow">
        <img
          src={challengerData?.imgLink || require("../../../imgs/account.png")}
          alt={challengerData?.name}
          className="w-14 h-14 object-contain mr-4"
        />
        <div>
          <h1 className="text-2xl font-bold text-blue-700">
            {challengerData?.name}
          </h1>
          <p className="text-gray-600">
            Admin: {challengerData?.adminUsername}
          </p>
        </div>
        <div className="ml-auto text-center">
          <div className="text-3xl font-bold text-blue-500">
            {challengerData?.score}/{totalQuestions}
          </div>
          <div className="text-sm text-gray-500">Punteggio</div>
        </div>
      </div>

      {questions?.length === 0 ? (
        <p className="flex justify-center w-full font-semibold">
          L'admin non ha ancora pubblicato domande
        </p>
      ) : (
        <>
          <div className="flex overflow-x-auto gap-2 items-center bg-white p-2 rounded-lg shadow">
            {questions?.map((question, index) => (
              <button
                key={question._id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-medium ${
                  index === currentQuestionIndex
                    ? question.isCorrect
                      ? "ring-2 ring-green-500 ring-offset-1"
                      : question.isCorrect === false
                      ? "ring-2 ring-red-500 ring-offset-2"
                      : "ring-2 ring-blue-500 ring-offset-2"
                    : ""
                } ${
                  question.wasAnswered
                    ? question.isCorrect
                      ? "bg-green-100 text-green-500"
                      : "bg-red-100 text-red-500"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <QuestionCard
            question={currentQuestion}
            index={currentQuestionIndex}
            selectedAnswer={
              currentQuestion && selectedAnswers[currentQuestion._id]
            }
            onSelectAnswer={handleSelectAnswer}
            onSubmit={handleSubmitAnswer}
            submitting={submitting}
          />

          <div className="flex justify-between items-center">
            <IconButton
              sx={{ padding: 0 }}
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestionIndex === 0}
            >
              <ArrowCircleLeftOutlinedIcon
                fontSize="large"
                sx={{
                  color: currentQuestionIndex === 0 ? "grey" : "#3b82f6",
                }}
              />
            </IconButton>

            <div className="text-center">
              <span className="text-blue-500 font-medium">
                {currentQuestionIndex + 1} di {totalQuestions}
              </span>
            </div>

            <IconButton
              sx={{ padding: 0 }}
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.min(prev + 1))
              }
              disabled={currentQuestionIndex === (questions || []).length - 1}
            >
              <ArrowCircleRightOutlinedIcon
                fontSize="large"
                sx={{
                  color:
                    currentQuestionIndex === (questions || []).length - 1
                      ? "grey"
                      : "#3b82f6",
                }}
              />
            </IconButton>
          </div>
        </>
      )}

      <CustomizedSnackbar
        isOpen={!!snackbarProps?.isOpen}
        setOwn={snackbarProps?.setOwn}
        content={snackbarProps?.content}
        severity={snackbarProps?.severity}
      />
    </div>
  );
};

export default Questions;
