import { findLast } from '@angular/compiler/src/directive_resolver';
import { Component, OnInit, Query } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ModalController, NavParams } from '@ionic/angular';
import { encargosClass } from '../clases/encargosClass';
import { ProductosClass } from '../clases/productosClass';


@Component({
  selector: 'app-encargos-modal',
  templateUrl: './encargos-modal.page.html',
  styleUrls: ['./encargos-modal.page.scss'],
  
})
export class EncargosModalPage {

  nombreCliente:string ="";

  fechaEncargo:string;
  fechaAux:string;
  horaEncargo:string;
  horaAux:string;
  userdata:any=[];
  productos: ProductosClass;
  totalEncargos:number;
  controlEncargo:boolean;

  constructor(
    public modalcontroller:ModalController,
    private db:AngularFirestore,
    private navparams : NavParams,
    
    ){
      this.fechaAux = new Date().toString();
      this.fechaEncargo = new Date(this.fechaAux).toLocaleDateString();
      this.horaAux = new Date().toString();
      this.horaEncargo = new Date(this.horaAux).toLocaleTimeString();
      this.userdata = JSON.parse(localStorage.getItem("usuario"));
      this.productos = navparams.get("productos");
      this.controlEncargo=true;

    }

  onChange(event){ // Detecta cambios en los campos #nombre #hora #fecha

    if(event.srcElement.id == "nombre"){
      this.nombreCliente = event.detail.value;
    }

    if(event.srcElement.id == "hora"){
      this.horaEncargo = new Date(event.detail.value).toLocaleTimeString();
      let sub = this.horaEncargo.split(":");
      this.horaEncargo = sub[0]+":"+sub[1];
    }

    if(event.srcElement.id == "fecha"){
      this.fechaEncargo = new Date(event.detail.value).toLocaleDateString();
    }

  }

  cancelar(){ //Cancelar el encargo
    this.modalcontroller.dismiss("cancelado");
  }

  aceptar(){ //Introducción nuevo encargo en BDD

    if(this.controlEncargo == true){
      
      let totalencargos;
      let helper = false;

      let encargosCollection:AngularFirestoreCollection  = this.db.collection(this.userdata.nombre+'/datos/encargos/', ref => ref.where("fecha","==",this.fechaEncargo));
          encargosCollection.valueChanges().subscribe(
            res =>{
              if(helper == false){
                helper = true;      

                if(this.nombreCliente.trim().length>0){

                 res.sort(function(a,b){
                    return a.numero - b.numero;
                  })

                  if(res.length > 0){
                    totalencargos = (res[res.length -1].numero)+1
                  }else{
                    totalencargos = 1;
                  }
                  let encargoid = this.db.createId();
                  let encargo = new encargosClass();
                  encargo.id = encargoid
                  encargo.cliente = this.nombreCliente;
                  encargo.numero = totalencargos;
                  encargo.fecha = this.fechaEncargo;
                  encargo.hora = this.horaEncargo;
                  encargo.productos = this.productos; 
                  this.db.doc(this.userdata.nombre+'/datos/encargos/'+encargoid).set(JSON.parse( JSON.stringify(encargo)));
                
                  this.totalEncargos = totalencargos;
                  this.controlEncargo = false;
                }

              }
              
            }); 

    } else {
      this.modalcontroller.dismiss("terminado");
    }

  }



}
