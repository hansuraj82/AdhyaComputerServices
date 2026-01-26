// utils/crypto.util.js
import crypto from "crypto";

const algorithm = "aes-256-cbc";
const ivLength = 16;

const getKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {


    throw new Error("ENCRYPTION_KEY missing");
  }

  const buf = Buffer.from(key, "hex");
  if (buf.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be 32 bytes (64 hex chars)");
  }

  return buf;
};

export const encrypt = (text) => {
  if (!text) return text;

  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, getKey(), iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
};

export const decrypt = (encryptedText) => {
  if (!encryptedText) return encryptedText;

  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(
    algorithm,
    getKey(),
    iv
  );

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
