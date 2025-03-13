import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  exports: [
    CommonModule,
    ButtonModule,
    FluidModule,
    CardModule,
    InputTextModule,
    FloatLabelModule,
    FieldsetModule,
    SelectModule,
    DividerModule,
    DynamicDialogModule,
    MenuModule,
    AvatarModule,
    CarouselModule,
    DialogModule,
    ToastModule,
    TableModule,
    DropdownModule,
    SkeletonModule,
    ProgressSpinnerModule,
    InputNumberModule
  ]
})
export class PrimengCommonModule { }
