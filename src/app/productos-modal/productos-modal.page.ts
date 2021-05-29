import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
  selector: 'app-productos-modal',
  templateUrl: './productos-modal.page.html',
  styleUrls: ['./productos-modal.page.scss'],
})
export class ProductosModalPage  {

  categorias:any=[];
  userdata:any=[];
  modo:string;

  idProducto:any=null;
  nombreProducto:any = null;
  precioProducto:any = null;
  posicionProducto:any = null;
  categoriaProducto:any = null;


  constructor(
    public modalcontroller:ModalController,
    private db:AngularFirestore,
    private navparams : NavParams,
  ) { 
    this.userdata = JSON.parse(localStorage.getItem("usuario"));
    this.cargarCategorias();

    if(this.navparams.get("producto") != null) {
  
      this.nombreProducto = navparams.get("producto").nombre;
      this.precioProducto =  parseFloat(navparams.get("producto").precio).toFixed(2) ;
      this.posicionProducto = navparams.get("producto").preferencia;
      this.categoriaProducto = navparams.get("producto").categoria;
      this.idProducto = navparams.get("producto").id;
      this.modo = "edit"

    }else{
      this.modo="create"
    }
  
  }

  cargarCategorias(){ //Carga las categorías
    let catsCollection:AngularFirestoreCollection = this.db.collection(this.userdata.nombre+'/datos/categorias/');
    catsCollection.valueChanges().subscribe(
      res =>{
          res.forEach(element=>{
            this.categorias.push(element.nombre);
          });
      }); 
  }

  selectCategoria(event){
    this.categoriaProducto = event.detail.value;
  }

  aceptar(){ //Aceptar
    if(this.precioProducto !=null && this.nombreProducto != null && this.categoriaProducto!=null && this.posicionProducto!=null){

      if (this.modo == "create"){
        this.idProducto= this.db.createId();
      }

      this.db.doc(this.userdata.nombre +'/datos/productos/' + this.idProducto).set({
        id:this.idProducto,
        nombre:this.nombreProducto,
        precio:this.precioProducto,
        preferencia:this.posicionProducto,
        categoria:this.categoriaProducto,
        activo:"true",
      });
      document.getElementById("btnaceptar").setAttribute("disabled","true");
   
      this.modalcontroller.dismiss("terminado");
    
    }
  }

  cancelar(){ //Cancelar el encargo
    this.modalcontroller.dismiss("cancelado");
  }

}
