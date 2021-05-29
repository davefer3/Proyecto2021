import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductosModalPageRoutingModule } from './productos-modal-routing.module';
import { ProductosModalPage } from './productos-modal.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductosModalPageRoutingModule,
  ],
  declarations: [ProductosModalPage]
})
export class ProductosModalPageModule {}
