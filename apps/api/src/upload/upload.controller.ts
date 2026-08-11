import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { roles } from '../decorators/roles.decorators.js';
import { Role } from '../generated/prisma/enums.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';
import { UploadService } from './upload.service.js';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard, RolesGuard)
@roles(Role.ADMIN)
@ApiTags('admin/uploads')
@ApiCookieAuth('session')
@ApiUnauthorizedResponse({ description: '未登录或登录状态已失效!' })
@ApiForbiddenResponse({ description: '仅管理员可访问!' })
@Controller('admin/uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('images')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_request, file, callback) => {
        callback(null, file.mimetype.startsWith('image/'));
      },
    }),
  )
  @ApiOperation({ summary: '上传图片' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: '上传成功!' })
  upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('请选择上传图片!');
    }

    return this.uploadService.saveImage(file);
  }
}
