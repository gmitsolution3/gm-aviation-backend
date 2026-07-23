import mongoose, { ClientSession } from "mongoose";

const withTransaction = async <T>(
  callback: (session: ClientSession) => Promise<T>,
): Promise<T> => {
  const session = await mongoose.startSession();

  try {
    const result = await session.withTransaction(async () => {
      return await callback(session);
    });

    return result as T;
  } finally {
    await session.endSession();
  }
};

export default withTransaction;
