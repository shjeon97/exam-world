import { Injectable } from '@nestjs/common';
import { CrawlingExamInput } from './dto/crawling-exam.dto';
import cheerio from 'cheerio';
import axios from 'axios';
import { ExamService } from 'src/exam/exam.service';
import { User } from 'src/entity/user.entity';
import { QuestionService } from 'src/question/question.service';
import { MultipleChoiceService } from 'src/multipleChoice/multipleChoice.service';

@Injectable()
export class CrawlingService {
  constructor(
    private readonly examService: ExamService,
    private readonly questionService: QuestionService,
    private readonly multipleChoiceService: MultipleChoiceService,
  ) {}

  async crawlingExam({ url }: CrawlingExamInput, user: User) {
    // axios는 Promise를 반환하기 때문에 then, catch를 통해 chaining 할 수 있다.
    axios({
      // 크롤링을 원하는 페이지 URL
      url,
      method: 'GET',
    })
      // 성공했을 경우
      .then(async (response) => {
        const $ = cheerio.load(response.data);

        const examTitleAndDescription = $('h4').text().split(' 시험일자 : ');

        const { examId } = await this.examService.createExam(
          {
            title: examTitleAndDescription[0],
            description: examTitleAndDescription[1],
            time: 1800,
            minimumPassScore: 85,
          },
          user,
        );
        const examList = $('.exam-question');
        $(examList).each((i, elem) => {
          const question = $(elem).find('h5').text();
          let multipleChoices = $(elem)
            .find('li')
            .text()
            .split(/① |② |③ |④ |<>/);

          multipleChoices = multipleChoices.filter((e) => e !== '');

          if (question) {
            this.questionService.saveQuestion({
              examId,
              text: question,
              page: i + 1,
              score: 5,
            });

            multipleChoices.map((multipleChoice, index) => {
              this.multipleChoiceService.saveMultipleChoice({
                examId,
                no: index + 1,
                page: i + 1,
                text: multipleChoice,
                isCorrectAnswer: false,
              });
            });
          }
        });
      })
      // 실패했을 경우
      .catch((err) => {
        console.error(err);
        return false;
      });
    return true;
  }
}
