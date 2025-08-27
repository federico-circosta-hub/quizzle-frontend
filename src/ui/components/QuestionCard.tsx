import { QuestionWithAnswer } from "../../types/questions";
const screenHeight = window.innerHeight;
const boxHeight = Math.floor(1.042 * screenHeight - 394.93);
const QuestionCard = ({
  question,
  index,
  selectedAnswer,
  onSelectAnswer,
  onSubmit,
  submitting,
}: {
  question: QuestionWithAnswer | undefined;
  index: number;
  selectedAnswer?: number;
  onSelectAnswer: (optionIndex: number) => void;
  onSubmit: () => void;
  submitting: boolean;
}) => {
  return (
    <div
      style={{ maxHeight: `${boxHeight}px` }}
      className={`bg-white overflow-auto p-4 rounded-lg shadow ${
        question?.wasAnswered
          ? question.isCorrect
            ? "border-l-8 border-green-500"
            : "border-l-8 border-red-500"
          : "border-l-8 border-blue-500"
      }`}
    >
      <p className="text-base font-semibold text-gray-800 mb-2">
        {question?.questionId.question}
      </p>
      {question?.questionId?.media && (
        <div className="w-full flex justify-center mb-4">
          <div
            style={{ width: 200, height: 150 }}
            className={`flex justify-center border border-gray-200 rounded-md`}
          >
            <img
              src={question?.questionId.media}
              alt="question media"
              max-width={180}
            />
          </div>
        </div>
      )}
      <div className="space-y-1">
        {question?.questionId.options.map((option, optIndex) => (
          <div key={optIndex}>
            <label
              className={`flex items-center p-3 rounded cursor-pointer ${
                question.wasAnswered
                  ? question.answer === optIndex
                    ? question.isCorrect
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                    : question.questionId.correctOpt === optIndex &&
                      !question.isCorrect
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-50 hover:bg-gray-100"
                  : selectedAnswer === optIndex
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <input
                type="radio"
                name={`question-${question._id}`}
                checked={
                  question.wasAnswered
                    ? question.answer === optIndex
                    : selectedAnswer === optIndex
                }
                onChange={() =>
                  !question.wasAnswered && onSelectAnswer(optIndex)
                }
                disabled={question.wasAnswered}
                className="mr-2 h-4 w-4"
              />
              <span>{option}</span>
            </label>
          </div>
        ))}
      </div>

      {!question?.wasAnswered && (
        <div className="mt-2 text-right">
          <button
            onClick={onSubmit}
            disabled={selectedAnswer === undefined || submitting}
            className={`px-4 py-2 rounded font-medium ${
              selectedAnswer !== undefined && !submitting
                ? "bg-blue-500 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {submitting ? "Invio in corso..." : "Invia Risposta"}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
