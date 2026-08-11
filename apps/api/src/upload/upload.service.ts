import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

@Injectable()
export class UploadService {
  private readonly uploadDir = resolve(process.cwd(), 'uploads');

  async saveImage(file: Express.Multer.File) {
    await mkdir(this.uploadDir, { recursive: true });

    const filename = `${randomUUID()}.webp`;

    try {
      await sharp(file.buffer, { limitInputPixels: 40_000_000 })
        .rotate()
        .webp({ quality: 85 })
        .toFile(resolve(this.uploadDir, filename));
    } catch {
      throw new UnsupportedMediaTypeException('请上传有效图片!');
    }

    return { path: `/uploads/${filename}` };
  }
}
