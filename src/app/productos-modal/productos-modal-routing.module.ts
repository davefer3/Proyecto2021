import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductosModalPage } from './productos-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ProductosModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductosModalPageRoutingModule {}
