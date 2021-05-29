import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VentasModalPageRoutingModule } from './ventas-modal-routing.module';

import { VentasModalPage } from './ventas-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VentasModalPageRoutingModule
  ],
  declarations: [VentasModalPage]
})
export class VentasModalPageModule {}
