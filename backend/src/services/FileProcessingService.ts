import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * File Processing Service for extracting text from documents
 */
class FileProcessingService {
  /**
   * Extract text from uploaded file based on MIME type
   */
  public async extractTextFromFile(filePath: string, mimeType: string): Promise<string> {
    try {
      switch (mimeType) {
        case 'application/pdf':
          return await this.extractFromPDF(filePath);

        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
          return await this.extractFromWord(filePath);

        case 'text/plain':
          return await this.extractFromText(filePath);

        default:
          console.warn(`Unsupported file type: ${mimeType}`);
          return '';
      }
    } catch (error: any) {
      console.error('Error extracting text:', error);
      throw new Error(`Failed to extract text: ${error.message}`);
    }
  }

  /**
   * Extract text from PDF
   */
  private async extractFromPDF(filePath: string): Promise<string> {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error: any) {
      console.error('PDF extraction error:', error);
      return '';
    }
  }

  /**
   * Extract text from Word document
   */
  private async extractFromWord(filePath: string): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error: any) {
      console.error('Word extraction error:', error);
      return '';
    }
  }

  /**
   * Extract text from plain text file
   */
  private async extractFromText(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error: any) {
      console.error('Text file extraction error:', error);
      return '';
    }
  }

  /**
   * Validate file type
   */
  public isSupportedFileType(mimeType: string): boolean {
    const supportedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
    return supportedTypes.includes(mimeType);
  }
}

export default new FileProcessingService();
