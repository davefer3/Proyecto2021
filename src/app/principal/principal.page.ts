import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosClass } from '../clases/productosClass';
import { ModalController } from '@ionic/angular';
import { EncargosModalPage } from '../encargos-modal/encargos-modal.page';
import { encargosClass } from '../clases/encargosClass';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage {

  prodsArray:any=[];
  carritodata:Array<any>=[];
  totalcompra = 0;

  controlEncargos:boolean = false;
  userdata:any=[];

  controlEncargoAll:encargosClass;

  constructor(
    private router:Router,
    private route: ActivatedRoute,
    private db:AngularFirestore,
    private modalController:ModalController,
 ) { 
  this.carritodata = [];
  this.loadproductos();

  this.route.queryParams.subscribe(params => {
    if (this.router.getCurrentNavigation().extras.state) {
      this.carritodata = this.router.getCurrentNavigation().extras.state.carritodata.productos;
      this.controlEncargos = this.router.getCurrentNavigation().extras.state.encargado;
      this.controlEncargoAll = this.router.getCurrentNavigation().extras.state.carritodata;
      this.calculartotal();

    }
  });

  }

  loadproductos(){ // CARGA DE PRODUCTOS DE LA BDD //
    this.userdata = JSON.parse(localStorage.getItem("usuario"));
    let prodsCollection:AngularFirestoreCollection = this.db.collection(this.userdata.nombre+'/datos/productos/');
    prodsCollection.valueChanges().subscribe(
  
      res =>{
          this.prodsArray = [];
          res.forEach(element=>{
          let productoind = new ProductosClass();

              productoind.id = element.id;
              productoind.categoria = element.categoria;
              productoind.nombre = element.nombre;
              productoind.precio = element.precio
              productoind.color = element.color

              this.prodsArray.push(productoind);
          
          })

          // Ordenar productos, primero por categoría y después por ID //
          this.prodsArray.sort(function (a, b) {
            return a.categoria - b.categoria || a.id - b.id;
          });

          this.loadCategorias();
          
      }
    );
   
  }

  loadCategorias(){// CARGA LAS CATEGORÍAS DE LOS PRODUCTOS PARA DARLES EL COLOR DE FONDO DE LA CATEGORÍA //
    let catsCollection:AngularFirestoreCollection = this.db.collection(this.userdata.nombre+'/datos/categorias/');
    catsCollection.valueChanges().subscribe(
      res =>{
          res.forEach(element=>{
            for(let a=0;a<this.prodsArray.length;a++){
              if(element.id == this.prodsArray[a].categoria){
                this.prodsArray[a].color = element.color;
              }
            }
          })
      } 
    )    
  }
 
  addproducto(producto:ProductosClass){// AÑADE LOS PRODUCTOS SELECCIONADOS AL CARRITO //
    let curentLength = this.carritodata.length;

    if(curentLength < 1){
      producto.preciotot = parseFloat(producto.precio);
      producto.cantidad = 1;
      this.carritodata.push(producto);
    }else{
      let prodIndex = this.carritodata.indexOf(producto);
      if(prodIndex != -1){
        this.carritodata[prodIndex].cantidad = this.carritodata[prodIndex].cantidad + 1;
        this.carritodata[prodIndex].preciotot = this.carritodata[prodIndex].cantidad * this.carritodata[prodIndex].precio;
      }else{
        producto.preciotot = parseFloat(producto.precio);
        producto.cantidad = 1;
        this.carritodata.push(producto);
      }
    }

    this.calculartotal();

  }

  calculartotal(){// CALCULA EL PRECIO TOTAL DE LOS PRODUCTOS AÑADIDOS AL CARRITO //
    this.totalcompra=0;
    this.carritodata.forEach(element=>{
      this.totalcompra =  this.totalcompra + parseFloat(element.preciotot);
    })
  }
 
  vaciarCarrito(){// VACÍA EL CARRITO //
    this.carritodata = [];
    this.totalcompra = 0;
    this.controlEncargos = false;
    this.controlEncargoAll = null;
    console.log(this.controlEncargoAll)
  }
  
  restarProducto(producto:ProductosClass){// RESTAR 1 AL TOTAL DEL PRODUCTO SELECCIONADO
    let indexprod = this.carritodata.indexOf(producto)

    if(this.carritodata[indexprod].cantidad == 1){
      this.carritodata.splice(indexprod,1);
    }else{
      this.carritodata[indexprod].cantidad = this.carritodata[indexprod].cantidad - 1 ;
      this.carritodata[indexprod].preciotot = this.carritodata[indexprod].precio * this.carritodata[indexprod].cantidad;
    }
    this.calculartotal();
  }

 async nuevoEncargo(){//REALIZAR UN NUEVO ENCARGO//
  if(this.controlEncargos == true){
    
    if(this.carritodata.length >0){
      this.controlEncargoAll.productos = this.carritodata
      console.log(this.controlEncargoAll);
      this.db.doc(this.userdata.nombre +'/datos/encargos/'+this.controlEncargoAll.id).update(JSON.parse(JSON.stringify(this.controlEncargoAll)));
      console.log("se ha modificado un encargo");
      this.vaciarCarrito();
    }

    }else{
    if(this.carritodata.length >0){
      const modalEncargo = await this.modalController.create({
        component:EncargosModalPage,
        cssClass:'my-custom-modal-css',
        componentProps:{
          'productos':this.carritodata
        },
        backdropDismiss: false,
      });
      modalEncargo.onDidDismiss().then(data=>{
        if(data.data == "terminado"){
          this.carritodata = [];
        }
      });
      return await modalEncargo.present();
  }

  

  }
  }

  verEncargos(){
    this.router.navigateByUrl('/encargos')
  }

}
