import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getRepository(Transaction);
    const tRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    if (type === 'outcome') {
      const balance = await tRepository.getBalance();
      if (value > balance.total) {
        throw new AppError("That's more that you can handle");
      }
    }

    const findCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    let transaction;

    if (findCategory) {
      transaction = transactionsRepository.create({
        title,
        value,
        type,
        category_id: findCategory.id,
      });
    } else {
      const newCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(newCategory);

      transaction = transactionsRepository.create({
        title,
        value,
        type,
        category_id: newCategory.id,
      });
    }

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
