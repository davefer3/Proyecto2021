import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { encargosClass } from '../clases/encargosClass';

@Component({
  selector: 'app-encargos',
  templateUrl: './encargos.page.html',
  styleUrls: ['./encargos.page.scss'],
})
export class EncargosPage  {

  fechaEncargo:string;
  fechaAux:string;
  encargos:Array<encargosClass>=[];
  userdata:any=[];

  constructor(
    private router:Router,
    private db:AngularFirestore,
    private alertController:AlertController
  ) {
    this.userdata = JSON.parse(localStorage.getItem("usuario"));
    this.setfecha();
    this.consultarEncargos();
  }

  setfecha(){ //Coloca la fecha de los encargos a visualizar en el día actual
    this.fechaAux = new Date().toString();
    this.fechaEncargo = new Date(this.fechaAux).toLocaleDateString();
  }

  volver(){ //Volver a pagina principal
    this.router.navigateByUrl('/principal');
  }

  onChange(event){ // controla cuando se produce un cambio en el datepicker
    this.fechaEncargo = new Date(event.detail.value).toLocaleDateString();
   
    this.consultarEncargos();
  }

  consultarEncargos(){ // busca los encargos de acuerdo a la fecha seleccionada en el datepicker
    let encargosCollection:AngularFirestoreCollection  = this.db.collection(this.userdata.nombre+'/datos/encargos/', ref => ref.where("fecha","==",this.fechaEncargo));
    encargosCollection.valueChanges().subscribe(
      res =>{
        this.encargos=[];
        res.forEach(element=>{
          let encargo = new encargosClass();
              encargo.id = element.id;
              encargo.cliente = element.cliente;
              encargo.fecha = element.fecha;
              let auxh = element.hora.split(":");
              encargo.hora = auxh[0]+':'+auxh[1];
              encargo.numero = element.numero;
              encargo.productos = element.productos;
              this.encargos.push(encargo);
        });
        this.encargos.sort(function(a,b){
          return a.numero - b.numero;
        })

      }); 
  }
  
  verDatosEncargo(encargo){ //vuelve a la pagina principal , pasandole a esta los datos del encargo seleccionado
    let navigationExtras: NavigationExtras = {
      state: {
        carritodata : encargo,
        encargado : true,
        encargoid : encargo.id
      }
    };
    this.router.navigate(['principal'], navigationExtras);
  }

  async borrarEncargo(encargo){ // borra el encargo seleccionado

    const alert = await this.alertController.create({
      mode:'ios',
      header: 'Borrar encargo',
      message: '¿Estas seguro de borrar este encargo?',
      buttons: [
        {
          text: 'Cancelar',
          handler:() => {
            
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.db.doc(this.userdata.nombre+'/datos/encargos/'+encargo.id).delete();
          }
        }
      ]
    });

  await alert.present();

  }


}
