import { Readable } from 'stream';
export class FromUploadFile {
	fieldname: string;
	originalname: string;
	encoding: string;
	mimetype: string;
	size: number; 	/** Size of the file in bytes. */ 
    stream: Readable;
	destination: string;
	filename: string;
	path: string;
	buffer: Buffer;
}
