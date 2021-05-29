import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'principal',
    loadChildren: () => import('./principal/principal.module').then( m => m.PrincipalPageModule)
  },
  {
    path: 'encargos-modal',
    loadChildren: () => import('./encargos-modal/encargos-modal.module').then( m => m.EncargosModalPageModule)
  },
  {
    path: 'encargos',
    loadChildren: () => import('./encargos/encargos.module').then( m => m.EncargosPageModule)
  },
  {
    path: 'ventas',
    loadChildren: () => import('./ventas/ventas.module').then( m => m.VentasPageModule)
  },
  {
    path: 'ofertas',
    loadChildren: () => import('./ofertas/ofertas.module').then( m => m.OfertasPageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./productos/productos.module').then( m => m.ProductosPageModule)
  },
  {
    path: 'productos-modal',
    loadChildren: () => import('./productos-modal/productos-modal.module').then( m => m.ProductosModalPageModule)
  },
  {
    path: 'categorias',
    loadChildren: () => import('./categorias/categorias.module').then( m => m.CategoriasPageModule)
  },
  {
    path: 'categorias-modal',
    loadChildren: () => import('./categorias-modal/categorias-modal.module').then( m => m.CategoriasModalPageModule)
  },
  {
    path: 'ventas-modal',
    loadChildren: () => import('./ventas-modal/ventas-modal.module').then( m => m.VentasModalPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
