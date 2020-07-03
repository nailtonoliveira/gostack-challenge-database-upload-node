import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const findTransactionById = transactionsRepository.findOne({ id });

    if (!findTransactionById) {
      throw new AppError("Transaction don't exists on database");
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
