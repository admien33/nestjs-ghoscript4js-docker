import { Injectable } from '@nestjs/common';
import { EXTENSION_A2B, EXTENSION_PDF, PATH_PDF, PATH_PDFA_DEF, PATH_RGB_ICC } from './constants/format-pdf.constant';
import { FromUploadFile } from './models/from-upload-file.model';
import * as fs from 'fs';
import { OuputPdfModel } from './models/output-pdf.model';
const gs = require('ghostscript4js');
const DEFAULT_FILENAME = 'attestation';

@Injectable()
export class GeneratePdfService {
	constructor() {}

	async formatPdf(files: FromUploadFile[]): Promise<OuputPdfModel> {
		let filenamePdf = DEFAULT_FILENAME;
		let pdfIn = `${PATH_PDF}${filenamePdf}${EXTENSION_PDF}`;
		let pdfOut = `${PATH_PDF}${filenamePdf}${EXTENSION_A2B}${EXTENSION_PDF}`;

		if (files.length > 0) {
			filenamePdf = files[0].originalname; //add timestamp TODO
			console.log('filename pdf to format :' + filenamePdf);
			pdfIn = `${PATH_PDF}${filenamePdf}${EXTENSION_PDF}`;
			pdfOut = `${PATH_PDF}${filenamePdf}${EXTENSION_A2B}${EXTENSION_PDF}`;
		}
		const cmdFormat =
			`-dBATCH -dNOPAUSE -dSAFER ` +
			`-dCompatibilityLevel=1.7 -sDEVICE=pdfwrite ` +
			`-dAutoRotatePages=/None -sColorConversionStrategy=RGB ` +
			`-dAutoFilterColorImages=true -dAutoFilterGrayImages=true -dJPEGQ=95 ` + // compression arg
			`-dPDFA=2 -dPDFACompatibilityPolicy=1 ` +
			`--permit-file-read=${PATH_RGB_ICC} -dPDFSETTINGS=/default ` +
			`-o ${pdfOut} ${PATH_PDFA_DEF} ${pdfIn}`;

		try {
			return new Promise((resolve, reject) => {
				console.log('cmdFormat to gs : ' + cmdFormat);
				gs.execute(cmdFormat)
					.then(() => {
						console.log('cmdAsync command successfully executed');
						if (filenamePdf !== DEFAULT_FILENAME) {
							fs.existsSync(pdfIn) && fs.unlinkSync(pdfIn);
						}
						const stream = fs.createReadStream(pdfOut) // TODO del pdfOut
						resolve({ filename: pdfOut.slice(pdfOut.lastIndexOf('/')+1), stream });
					})
					.catch((err: any) => {
						console.error('cmdAsync command error => ', err);
						if (filenamePdf !== DEFAULT_FILENAME) {
							fs.existsSync(pdfIn) && fs.unlinkSync(pdfIn);
						}
						reject(err);
					});
			});
		} catch (error) {
			if (filenamePdf !== DEFAULT_FILENAME) {
				fs.existsSync(pdfIn) && fs.unlinkSync(pdfIn);
			}
			return Promise.reject(error);
		}
	}
}
