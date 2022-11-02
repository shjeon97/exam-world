import { ApiProperty } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';

export class UploadImageInput {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}

export class UploadImageOutput extends CoreOutput {
  fileURL?: string;
}
