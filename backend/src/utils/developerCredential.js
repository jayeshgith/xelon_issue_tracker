import crypto from 'crypto';

const algorithm = 'aes-256-gcm';

const getKey = () => {
  const value = process.env.DEVELOPER_CREDENTIAL_KEY;

  if (!value || !/^[a-f0-9]{64}$/i.test(value)) {
    throw new Error('DEVELOPER_CREDENTIAL_KEY must be a 64-character hexadecimal value');
  }

  return Buffer.from(value, 'hex');
};

export const encryptDeveloperPassword = (password) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(password, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [iv.toString('hex'), authTag.toString('hex'), encrypted.toString('hex')].join(':');
};

export const decryptDeveloperPassword = (value) => {
  const [ivHex, authTagHex, encryptedHex] = String(value || '').split(':');

  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error('Invalid encrypted developer credential');
  }

  const decipher = crypto.createDecipheriv(algorithm, getKey(), Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

  return Buffer.concat([decipher.update(Buffer.from(encryptedHex, 'hex')), decipher.final()]).toString('utf8');
};

export const generateDeveloperCredentialKey = () => crypto.randomBytes(32).toString('hex');
