import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MultipleChoice } from 'src/entity/multiple-choice.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MultipleChoiceService {
  constructor(
    @InjectRepository(MultipleChoice)
    private readonly multipleChoice: Repository<MultipleChoice>,
  ) {}
}
