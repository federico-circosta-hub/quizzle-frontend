export type signupPayload = {
  username: string;
  password: string;
  passphrase: string;
};
export type loginPayload = { username: string; password: string };

export type addQuestionPayload = {
  question: string;
  options: string[];
  correctOpt: number;
  adminUsername: string;
  jwt: string;
};
