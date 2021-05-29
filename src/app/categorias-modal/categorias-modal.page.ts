import { Component } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
  selector: 'app-categorias-modal',
  templateUrl: './categorias-modal.page.html',
  styleUrls: ['./categorias-modal.page.scss'],
})
export class CategoriasModalPage {

  userdata:any=[];

  idCat:any;
  colorCat:String = "#ffffff";
  nombreCat:string;
  preferenciaCat:string;

  controlComp:boolean=false;
  modo:string;

  constructor(
    public modalcontroller:ModalController,
    private db:AngularFirestore,
    private navparams : NavParams,
    private toastController:ToastController
  ) { 
    this.userdata = JSON.parse(localStorage.getItem("usuario"));

    if(this.navparams.get("categoria") != null) {
  
      this.nombreCat = navparams.get("categoria").nombre;
      this.colorCat = navparams.get("categoria").color;
      this.preferenciaCat = navparams.get("categoria").preferencia;
      this.idCat = navparams.get("categoria").id;
      this.modo = "edit"

    }else{
      this.modo="create"
    }

  }

  cambioColor(event){
    this.colorCat = event
  }

  cancelar(){ //Cancelar el encargo
    this.modalcontroller.dismiss("cancelado");
  }

  aceptar(){
    
    if (this.modo =="create"){
      let catsCollection:AngularFirestoreCollection = this.db.collection(this.userdata.nombre+'/datos/categorias/');
      catsCollection.valueChanges().subscribe(res=>{
        res.forEach(element=>{
          if(element.nombre.toLowerCase() == this.nombreCat.toLowerCase()){
            this.controlComp = true;
          }
        });
        if(this.controlComp ==false){
          this.idCat= this.db.createId();
          this.db.doc(this.userdata.nombre +'/datos/categorias/' + this.idCat).set({
            id:this.idCat,
            color: this.colorCat,
            nombre:this.nombreCat,
            preferencia:this.preferenciaCat,
            activo:"true"
          });
        }else{
          //this.presentToast();
        }
      });
    }else{
      this.db.doc(this.userdata.nombre +'/datos/categorias/' + this.idCat).set({
        id:this.idCat,
        color: this.colorCat,
        nombre:this.nombreCat,
        preferencia:this.preferenciaCat,
        activo:"true"
      });
    }

    document.getElementById("btnaceptar").setAttribute("disabled","true");
    this.modalcontroller.dismiss("terminado");

  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Ya existe una categoría con ese nombre',
      duration: 2000,
      mode:'ios'
    });
    toast.present();
  }

}
