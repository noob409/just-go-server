import bcrypt from "bcrypt";

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

export const hashValue = async (value) => {
  const hashedValue = await bcrypt.hash(value, SALT_ROUNDS);
  return hashedValue;
};

export const compareValue = async (value, hashedVassword) => {
  return await bcrypt.compare(value, hashedVassword);
};
