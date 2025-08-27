export type signupPayload = {
  username: string;
  password: string;
  passphrase: string;
};
export type loginPayload = { username: string; password: string };

export type addQuestionPayload = {
  question: string;
  media: string;
  options: string[];
  correctOpt: number;
  adminUsername: string;
  jwt: string;
};

export type editQuestionPayload = {
  id: string;
  question: string;
  media: string;
  options: string[];
  correctOpt: number;
  adminUsername: string;
  jwt: string;
};
