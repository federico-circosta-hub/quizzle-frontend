import CryptoJS from "crypto-js";
import { errorType } from "../types/misc";
export {};

export const decryptString = (
  ciphertext: string,
  iv: string,
  secretKey: string
) => {
  const bytes = CryptoJS.AES.decrypt(
    ciphertext,
    CryptoJS.enc.Utf8.parse(secretKey),
    {
      iv: CryptoJS.enc.Base64.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const getError = (error: errorType) => {
  return error.data.error;
};
