import CryptoJS from "crypto-js";

const key = process.env.REACT_APP_ENCRYTION_SECRET_KEY as string | undefined;

export const encryptMessage = (message: string) => {
  // const cipher = crypto.createCipher("aes-256-ctr", bufferKey);
  // const encryptedMessage = Buffer.concat([
  //   cipher.update(message, "utf8"),
  //   cipher.final(),
  // ]);
  // return encryptedMessage.toString();
  const ciphertext = CryptoJS.AES.encrypt(message, key!).toString();
  return ciphertext;
};

export const decryptMessage = (encryptedMessage: string) => {
  // const decipher = crypto.createDecipher("aes-256-ctr", bufferKey);
  // const decryptedMessage = Buffer.concat([
  //   decipher.update(encryptedMessage),
  //   decipher.final(),
  // ]);
  // return decryptedMessage.toString("utf8");
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, key!);
  const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedText;
};
