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

  async getBase64(
    url: string,
    text: any,
    score: number,
    examId: number,
    page: number,
  ) {
    const base64 = await axios
      .get(url, {
        responseType: 'arraybuffer',
      })
      .then((response) =>
        Buffer.from(response.data, 'binary').toString('base64'),
      );

    if (base64) {
      this.questionService.saveQuestion({
        examId,
        text:
          text.replace(/(.{40})/g, '$1</br>') +
          `</br>ㅤ<img src="data:image/gif;base64,${base64}" width="100%" height="auto">`,
        score,
        page,
      });
    }
  }

  async crawlingExam({ url }: CrawlingExamInput, user: User) {
    try {
      await axios({
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
              time: 0,
              minimumPassScore: 0,
            },
            user,
          );

          const examList = $('.exam-question');
          $(examList).each((i, elem) => {
            const question = $(elem).find('h5').text().slice(3);
            const img = $(elem).find('img').attr('src');
            // console.log(img);

            let multipleChoices = $(elem)
              .find('li')
              .text()
              .split(/① |② |③ |④ |⑤ |<>/);

            multipleChoices = multipleChoices.filter((e) => e !== '');

            if (question) {
              if (img) {
                this.getBase64(
                  'https://www.kinz.kr' + img,
                  question,
                  0,
                  examId,
                  i + 1,
                );
              } else {
                this.questionService.saveQuestion({
                  examId,
                  text: question.replace(/(.{40})/g, '$1</br>'),
                  page: i + 1,
                  score: 0,
                });
              }
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
          return true;
        })
        // 실패했을 경우
        .catch((err) => {
          console.error(err);
          return false;
        });
    } catch (error) {
      console.log(error);
    }
  }
}
