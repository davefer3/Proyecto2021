import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriasModalPageRoutingModule } from './categorias-modal-routing.module';

import { CategoriasModalPage } from './categorias-modal.page';
import { ColorPickerModule } from 'ngx-color-picker';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriasModalPageRoutingModule,
    ColorPickerModule
  ],
  declarations: [CategoriasModalPage]
})
export class CategoriasModalPageModule {}
