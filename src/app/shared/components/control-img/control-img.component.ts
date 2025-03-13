import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { LoadingService } from '../../services/loading.service';
import { PrimengCommonModule } from '../../modules/primeng-common.module';
import { CommonModule } from '@angular/common';
import { GenerateObjetsService } from '../../services/generate-object.service';

@Component({
  selector: 'shared-components-control-img',
  imports: [PrimengCommonModule, CommonModule],
  templateUrl: './control-img.component.html',
  styleUrl: './control-img.component.css'
})
export class ControlImgComponent implements OnChanges {

  @Input() file: File | null = null;
  @Input() imgControl: AbstractControl | null = null;
  @Input() disabled: boolean = false;
  @Output() fileUpload: EventEmitter<File | null> = new EventEmitter<File | null>;


  public safeUrlImgMedium: SafeUrl | null = null;
  public loading: boolean = false;

  constructor(
    private generateObjectService: GenerateObjetsService,
    private loadingService: LoadingService
  ) {
    this.safeUrlImgMedium = null;


  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {

    if (changes['file']) {

      let result = changes['file'].currentValue as File;

      if (result) {
        this.loading = true;
        this.safeUrlImgMedium = null;
        await this.SetValueImgControl(result);
        await this.SetImgToShow(result);
      }
      else {
        await this.resetImg();
      }
    }
  }

  public onLoad() {
    this.loading = false;
  }

  public async onUploadFile(event: any) {

    let itemFile = event.target.files[0];
    itemFile = await this.SetObjectURLToFile(itemFile);
    event.target.value = '';
    await this.SendFileToParent(itemFile);

  }

  public async onRemoveImg() {
    await this.resetImg();
  }

  private async resetImg(): Promise<void> {
    this.loading = false;
    this.SetValueImgControl(null);
    this.safeUrlImgMedium = null;
  }

  private async SendFileToParent(fileParam: File): Promise<void> {
    this.fileUpload.emit(fileParam);
  }

  private async SetImgToShow(fileParam: File): Promise<void> {

    let safeUrlResult = (<any>fileParam).objectURL;
    this.safeUrlImgMedium = safeUrlResult;

  }

  private async SetObjectURLToFile(fileParam: File): Promise<File> {

    (<any>fileParam).objectURL = await this.generateObjectService.GetSafeUrlOfFile(fileParam);

    return fileParam;
  }

  private async SetValueImgControl(fileParam: File | null): Promise<void> {
    this.imgControl?.setValue(fileParam);
    this.imgControl?.updateValueAndValidity();
  }


}
