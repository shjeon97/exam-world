import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exam } from 'src/entity/exam.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private readonly exam: Repository<Exam>,
  ) {}
}
