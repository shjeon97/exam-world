import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Post,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UploadImageOutput } from 'src/image/dto/upload-image.dto';
import { multerOption } from 'src/multer/multer.option';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: '이미지 업로드' })
  @ApiResponse({ type: UploadImageOutput })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', multerOption))
  @Post()
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadImageOutput> {
    try {
      return {
        ok: true,
        fileURL: `${process.env.SERVER_ADDRESS}/../public/upload/${file.filename}`,
      };
    } catch (error) {
      return {
        ok: false,
        error: '이미지 업로드 실패',
      };
    }
  }
}
