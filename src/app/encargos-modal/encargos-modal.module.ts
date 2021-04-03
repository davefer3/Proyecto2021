import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncargosModalPageRoutingModule } from './encargos-modal-routing.module';

import { EncargosModalPage } from './encargos-modal.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncargosModalPageRoutingModule,
    
  ],
  declarations: [EncargosModalPage]
})
export class EncargosModalPageModule {}
