import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ProductosModalPage } from '../productos-modal/productos-modal.page';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage {

  userdata:any=[];
  productos:any=[];

  constructor(
    private router:Router,
    private db:AngularFirestore,
    private alertController:AlertController,
    private modalController:ModalController,
  ) { 
    this.userdata = JSON.parse(localStorage.getItem("usuario"));
    this.cargarProductos();
  }

  volver(){ //vuelve a la pagina principal
    this.router.navigateByUrl('/principal');
  }

  cargarProductos(){ //Carga los productos

    let productosCollection2:AngularFirestoreCollection = this.db.collection(this.userdata.nombre+'/datos/productos/');
    productosCollection2.valueChanges().subscribe(     
      res=>{
        this.productos =[];
        res.forEach(element =>{
          this.productos.push(element);
        })

        
        this.productos.sort(function (a, b) {
          if (a.categoria > b.categoria) {
            return 1;
          }
          if (a.categoria < b.categoria) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });

      })

  }

  cambioEstadoOferta(producto,event){ //Al modificar el Toggle, se modifica el estado en la base de datos
    this.db.collection(this.userdata.nombre+'/datos/productos/').doc(producto.id).update({
      activo: event.detail.checked.toString()
    })
  }

  async nuevoProducto(){
    const modalEncargo = await this.modalController.create({
      component:ProductosModalPage,
      cssClass:'productos-modal',
      componentProps:{
        
      },
      backdropDismiss: false,
    });
    modalEncargo.onDidDismiss().then(data=>{
    });
    
    return await modalEncargo.present();
  }

  async borrarProducto(producto){
    
    const alert = await this.alertController.create({
      mode:'ios',
      header: 'Borrar producto',
      message: '¿Estas seguro de borrar el producto: ' + producto.nombre+' ?',
      buttons: [
        {
          text: 'Cancelar',
          handler:() => {
            
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.db.doc(this.userdata.nombre+'/datos/productos/'+producto.id).delete();
          }
        }
      ]
    });

  await alert.present();

  }


  async editarProducto(producto){
    const modalEncargo = await this.modalController.create({
      component:ProductosModalPage,
      cssClass:'productos-modal',
      componentProps:{
        'producto':producto
      },
      backdropDismiss: false,
    });
    modalEncargo.onDidDismiss().then(data=>{
      
    });
    
    return await modalEncargo.present();
  }

}
