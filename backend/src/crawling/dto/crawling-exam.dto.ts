import { ApiProperty } from '@nestjs/swagger';

export class CrawlingExamInput {
  @ApiProperty({ description: '크롤링할 페이지 url' })
  url: string;
}
