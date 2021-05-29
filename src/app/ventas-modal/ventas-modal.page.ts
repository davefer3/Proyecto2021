import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-ventas-modal',
  templateUrl: './ventas-modal.page.html',
  styleUrls: ['./ventas-modal.page.scss'],
})
export class VentasModalPage {

  venta:any=[];
  generado:any=0;

  constructor(
    private navparams : NavParams,
  ) {
    this.venta = navparams.get("venta");
    console.log(this.venta)

    this.calcularGenerado()
   }
  
   calcularGenerado(){
    this.generado=0;
    for(let x=0;x<this.venta.productos.length;x++){
     this.generado = this.generado + this.venta.productos[x].preciotot;
    }

   }

}
