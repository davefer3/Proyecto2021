import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncargosPageRoutingModule } from './encargos-routing.module';

import { EncargosPage } from './encargos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncargosPageRoutingModule
  ],
  declarations: [EncargosPage]
})
export class EncargosPageModule {}
