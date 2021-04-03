import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EncargosModalPage } from './encargos-modal.page';

const routes: Routes = [
  {
    path: '',
    component: EncargosModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EncargosModalPageRoutingModule {}
