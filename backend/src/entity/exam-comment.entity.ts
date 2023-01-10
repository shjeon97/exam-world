// import { ApiProperty } from '@nestjs/swagger';
// import { Column, Entity, ManyToOne, PrimaryColumn, RelationId } from 'typeorm';
// import { Exam } from './exam.entity';

// @Entity()
// export class ExamComment {
//   @ManyToOne(() => Exam, { onDelete: 'CASCADE' })
//   exam: Exam;

//   @ApiProperty({ description: '시험 id' })
//   @RelationId((multipleChoice: ) => multipleChoice.exam)
//   examId: number;

//   @ApiProperty({ description: '시험 페이지 번호' })
//   @Column()
//   like: number;

//   @ApiProperty({ description: '보기 내용' })
//   @Column()
//   text: string;

//   @ApiProperty({ description: '정답' })
//   @Column()
//   isCorrectAnswer: boolean;
// }
