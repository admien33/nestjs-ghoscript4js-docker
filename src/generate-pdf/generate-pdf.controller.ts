import {
	Controller,
	Header,
	Post,
	Response,
	UseInterceptors,
	UploadedFiles,
	HttpException,
	HttpStatus,
	StreamableFile,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { GeneratePdfService } from './generate-pdf.service';
import * as fs from 'fs';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FromUploadFile } from './models/from-upload-file.model';
import { EXTENSION_PDF, PATH_PDF } from './constants/format-pdf.constant';
const gs = require('ghostscript4js');

@Controller()
export class GeneratePdfController {
	constructor(private readonly _generatePdfService: GeneratePdfService) {}

	@Header('Content-Type', 'application/pdf')
	@Header('Cache-Control', 'no-cache, no-store, must-revalidate')
	@Header('Pragma', 'no-cache')
	@Header('Expires', '0')
	@UseInterceptors(
		FilesInterceptor('file', undefined, {
			storage: diskStorage({
				destination: `${PATH_PDF}`,
				filename: (req: any, file: any, cb: any) => {
					const filename = file.originalname + EXTENSION_PDF;
					cb(null, filename);
				},
			}),
		})
	)
	@Post('format-pdf')
	async formatPdfFile(@UploadedFiles() files: FromUploadFile[], @Response({ passthrough: true }) res: any) {
		try {
			const ouput = await this._generatePdfService.formatPdf(files);
			res.set({
				'Content-Disposition': `attachment; filename=${ouput.filename}`,
				'Access-Control-Expose-Headers': 'Content-Disposition',
			});

			return new StreamableFile(ouput.stream)
		} catch (error: any) {
			throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
