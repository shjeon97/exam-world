import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/entity/user.entity';
import { CrawlingService } from './crawling.service';
import { CrawlingExamInput } from './dto/crawling-exam.dto';

@Controller('crawling')
export class CrawlingController {
  constructor(private readonly crawlingService: CrawlingService) {}

  @ApiOperation({ summary: '시험 문제 크롤링' })
  @ApiBearerAuth('authorization')
  @Post('')
  @Role(['Any'])
  @UseGuards(JwtAuthGuard)
  async crawlingExam(
    @GetUser() user: User,
    @Body() crawlingExamInput: CrawlingExamInput,
  ) {
    return this.crawlingService.crawlingExam(crawlingExamInput, user);
  }
}
