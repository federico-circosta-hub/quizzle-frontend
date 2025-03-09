import { QuestionWithAnswer } from "./questions";

export type Challenger = {
  _id: string;
  name: string;
  adminUsername: string;
  imgLink: string;
  questions?: QuestionWithAnswer[];
  score: number;
  __v: number;
};
