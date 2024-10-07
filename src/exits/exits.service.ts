import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/types';
import { ExitsEntity } from './exits.entity';
import { CreateExitsDto } from './dto/create-exits.dto';

@Injectable()
export class ExitsService {
  constructor(
    @InjectRepository(ExitsEntity)
    private expensesRepository: Repository<ExitsEntity>,
  ) {}

  async get(userId: string): Promise<ApiResponse<ExitsEntity>> {
    const [data, totalItems] = await this.expensesRepository.findAndCount({
      where: { userId },
    });

    return {
      data,
      totalItems,
    };
  }

  async getById(id: string): Promise<ExitsEntity> {
    const data = await this.expensesRepository.findOneBy({ id });

    return data;
  }

  async create(body: CreateExitsDto, userId: string): Promise<ExitsEntity> {
    const expense = this.expensesRepository.create({ ...body, userId });

    return await this.expensesRepository.save(expense);
  }

  async update(body: CreateExitsDto, id: string): Promise<ExitsEntity> {
    const expense = await this.expensesRepository.preload({
      id,
      ...body,
    });

    this.expensesRepository.save(expense);

    return expense;
  }

  async delete(id: string) {
    const expense = await this.expensesRepository.findOneBy({ id });

    await this.expensesRepository.remove(expense);

    return expense;
  }
}
