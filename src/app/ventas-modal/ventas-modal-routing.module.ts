import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VentasModalPage } from './ventas-modal.page';

const routes: Routes = [
  {
    path: '',
    component: VentasModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentasModalPageRoutingModule {}
