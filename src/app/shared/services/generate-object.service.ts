import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeUrl, SafeValue } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class GenerateObjetsService {
  constructor(
    private sanitizer: DomSanitizer
  ) { }

  public async GetUrlStringSecurityOfFile(fileParam: File): Promise<string> {

    let result: string;

    const url = URL.createObjectURL(fileParam);

    result = this.sanitizer.sanitize(SecurityContext.URL, this.sanitizer.bypassSecurityTrustUrl(url))!;

    return result;
  }

  public async GetSafeUrlOfFile(fileParam: File): Promise<string> {

    let result: string;

    const url = URL.createObjectURL(fileParam);

    result = this.sanitizer.sanitize(SecurityContext.URL, this.sanitizer.bypassSecurityTrustUrl(url))!;

    return result;
  }

  public async GetUrlSecurityOfUrl(urlParam: string): Promise<string> {

    let result: string;

    result = this.sanitizer.sanitize(SecurityContext.URL, this.sanitizer.bypassSecurityTrustUrl(urlParam))!;

    return result;
  }

  public async GetSafeUrlOfUrl(urlParam: string): Promise<SafeUrl> {

    let result: SafeUrl;

    result = this.sanitizer.sanitize(SecurityContext.URL, this.sanitizer.bypassSecurityTrustUrl(urlParam))!;

    return result;
  }

  public async GetFileWithUrlSecurityOfUrl(urlParam: string, fileName: string, fileType: string): Promise<File> {

    const blob = await this.downloadFileAsBlog(urlParam);
    const file = await this.createFileFromBlob(blob, fileName, fileType);
    const urlSecurity = await this.GetUrlStringSecurityOfFile(file);

    (<any>file).objectURL = urlSecurity;

    return file;
  }

  public async GetFileToUrl(urlFile : string, fileName : string, fileType : string) : Promise<File>{

    let fileBlob = await this.downloadFileAsBlog(urlFile);
    let file = await this.createFileFromBlob(fileBlob, fileName, fileType);

    return file;
  }

  private async downloadFileAsBlog(url: string): Promise<Blob> {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  }

  private async createFileFromBlob(blob: Blob, fileName: string, fileType: string): Promise<File> {
    const file = new File([blob], fileName, { type: fileType });
    return file;
  }

}

