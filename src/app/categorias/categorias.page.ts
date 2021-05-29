import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { CategoriasModalPage } from '../categorias-modal/categorias-modal.page';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage {

  categorias:any = [];
  userdata:any=[];

  constructor(
    private router:Router,
    private db:AngularFirestore,
    private alertController:AlertController,
    private modalController:ModalController,
  ) {
    this.userdata = JSON.parse(localStorage.getItem("usuario"));
    this.cargarCategorias()
  }

  cargarCategorias(){

    let categoriasCollection2:AngularFirestoreCollection = this.db.collection(this.userdata.nombre+'/datos/categorias/');
    categoriasCollection2.valueChanges().subscribe(

      res=>{
        this.categorias =[];
        res.forEach(element =>{
          this.categorias.push(element);
        })

        
        this.categorias.sort(function (a, b) {
          if (a.nombre > b.nombre) {
            return 1;
          }
          if (a.nombre < b.nombre) {
            return -1;
          }
          return 0;
        });

      }); 

  }

  cambioEstadoCategoria(categoria,event){ //Al modificar el Toggle, se modifica el estado en la base de datos
    this.db.collection(this.userdata.nombre+'/datos/categorias/').doc(categoria.id).update({
      activo: event.detail.checked.toString()
    })

  }

  async borrarCategoria(categoria){ //Borrar una categoría
    
    const alert = await this.alertController.create({
      mode:'ios',
      header: 'Borrar producto',
      message: '¿Estas seguro de borrar el producto: ' + categoria.nombre+' ?',
      buttons: [
        {
          text: 'Cancelar',
          handler:() => {
            
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            
            let prodsCollection3:AngularFirestoreCollection = this.db.collection(this.userdata.nombre+'/datos/productos/',ref=> ref.where("categoria","==",categoria.nombre));
            prodsCollection3.valueChanges().subscribe(res=>{
              res.forEach(element =>{

                this.db.collection(this.userdata.nombre+'/datos/productos/').doc(element.id).update({
                  categoria:"sin categoria"
                })
              });
            });

            setTimeout(() => {
              this.db.doc(this.userdata.nombre+'/datos/categorias/'+categoria.id).delete();
            }, 2000);
            
          }
        }
      ]
    });

  await alert.present();

  }

  async nuevaCategoria(){
    const modalEncargo = await this.modalController.create({
      component:CategoriasModalPage,
      cssClass:'productos-modal',
      componentProps:{
        
      },
      backdropDismiss: false,
    });
    modalEncargo.onDidDismiss().then(data=>{
    });
    
    return await modalEncargo.present();
  }


  async editarCategoria(categoria){
    const modalEncargo = await this.modalController.create({
      component:CategoriasModalPage,
      cssClass:'productos-modal',
      componentProps:{
        'categoria':categoria
      },
      backdropDismiss: false,
    });
    modalEncargo.onDidDismiss().then(data=>{
      
    });
    
    return await modalEncargo.present();
  }

  volver(){ //vuelve a la pagina principal
    this.router.navigateByUrl('/principal');
  }

}
