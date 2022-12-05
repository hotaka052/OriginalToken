import {
  createHash,
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'crypto';

/**
 * @dev テキストをhash化する関数
 */
export const sha256 = (text: string): string => {
  return createHash('sha256').update(text).digest('hex');
};

/**
 * 暗号化
 */
export const encrypt = (text: string): string => {
  // 暗号器を作成
  const cryptoKey = process.env.CRYPTO_KEY;
  const cryptoSalt = process.env.CRYPTO_SALT;
  const key = scryptSync(cryptoKey, cryptoSalt, 32);
  const iv = Buffer.from(process.env.BUFFER_KEY).slice(0, 16);
  const method = process.env.CRYPTO_METHOD;
  const cipher = createCipheriv(method, key, iv);

  let data = cipher.update(text);
  data = Buffer.concat([data, cipher.final()]);

  return data.toString('hex');
};

/**
 * 複合化
 */
export const decrypto = (text: string): string => {
  // 復号器作成
  const cryptoKey = process.env.CRYPTO_KEY;
  const cryptoSalt = process.env.CRYPTO_SALT;
  const key = scryptSync(cryptoKey, cryptoSalt, 32);
  const iv = Buffer.from(process.env.BUFFER_KEY).slice(0, 16);
  const method = process.env.CRYPTO_METHOD;
  const decipher = createDecipheriv(method, key, iv);

  //   textの型変更
  const encryptedText = Buffer.from(text, 'hex');

  let data = decipher.update(encryptedText);
  data = Buffer.concat([data, decipher.final()]);

  return data.toString();
};
