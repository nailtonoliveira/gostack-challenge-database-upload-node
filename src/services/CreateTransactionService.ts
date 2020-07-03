import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('This type of transaction is not valid', 401);
    }

    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance();

      if (value > balance.total) {
        throw new AppError(
          "Haven't no balance to create this transaction.",
          400,
        );
      }
    }

    const categoryRepository = getRepository(Category);

    let currentCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!currentCategory) {
      currentCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(currentCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: currentCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
