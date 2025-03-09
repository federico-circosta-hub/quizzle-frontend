export type Question = {
  _id: string;
  question: string;
  options: string[];
  correctOpt: number;
  adminUsername: string;
  __v: number;
};

export type NewQuestion = {
  question: string;
  options: string[];
  correctOpt: number | undefined;
  adminUsername: string;
};

export type QuestionWithAnswer = {
  questionId: Question;
  wasAnswered: boolean;
  _id: string;
  answer?: number;
  isCorrect?: boolean;
};
