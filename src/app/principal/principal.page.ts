import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosClass } from '../clases/productosClass';
import { AlertController, ModalController } from '@ionic/angular';
import { EncargosModalPage } from '../encargos-modal/encargos-modal.page';
import { encargosClass } from '../clases/encargosClass';
import { ventasClass } from '../clases/ventasClass';

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
  controlEncargoAll:encargosClass;
  controlEncargoId = null;
  userdata:any=[];

  diaSemana = {
    0:"domingo",
    1:"lunes",
    2:"martes",
    3:"miercoles",
    4:"jueves",
    5:"viernes",
    6:"sabado"
  }

  metodoPago:string;

  constructor(
    private router:Router,
    private route: ActivatedRoute,
    private db:AngularFirestore,
    private modalController:ModalController,
    private alertController:AlertController,
 ) { 
  this.carritodata = [];
  this.userdata = JSON.parse(localStorage.getItem("usuario"));
  this.loadproductos();
  this.loadCategorias();
  this.controlarVisibilidad();

  this.route.queryParams.subscribe(params => {
    if (this.router.getCurrentNavigation().extras.state) {
      this.carritodata = this.router.getCurrentNavigation().extras.state.carritodata.productos;
      this.controlEncargos = this.router.getCurrentNavigation().extras.state.encargado;
      this.controlEncargoAll = this.router.getCurrentNavigation().extras.state.carritodata;
      this.controlEncargoId = this.router.getCurrentNavigation().extras.state.encargoid;
      this.calculartotal();

    }
  });

  }

  loadproductos(){ // CARGA DE PRODUCTOS DE LA BDD //
    
    let prodsCollection:AngularFirestoreCollection = this.db.collection(this.userdata.nombre+'/datos/productos/');
    prodsCollection.valueChanges().subscribe(
  
      res =>{
          this.prodsArray = [];
          res.forEach(element=>{

            if(element.activo == "true" && element.categoria!="sin categoria") {
              let productoind = new ProductosClass();
              productoind.id = element.id;
              productoind.categoria = element.categoria;
              productoind.nombre = element.nombre;
              productoind.precio = element.precio
              productoind.preferenciaProducto = element.preferencia;

              this.prodsArray.push(productoind);
            }
            this.prodsArray.sort(function (a, b) {
              if (a.preferenciaProducto > b.preferenciaProducto) {
                return 1;  
              }
              if (a.preferenciaProducto < b.preferenciaProducto) {
                return -1;
              }
              return 0;
            });
           
          });  
          this.loadCategorias();
      });
   
      

  }

  loadCategorias(){// CARGA LAS CATEGORÍAS DE LOS PRODUCTOS PARA DARLES EL COLOR DE FONDO DE LA CATEGORÍA //
    let catsCollection:AngularFirestoreCollection = this.db.collection(this.userdata.nombre+'/datos/categorias/');
    catsCollection.valueChanges().subscribe(
      res =>{

          res.forEach(element=>{
            for(let a=0;a<this.prodsArray.length;a++){

                if(element.nombre == this.prodsArray[a].categoria ){
                  this.prodsArray[a].color = element.color;
                  this.prodsArray[a].preferenciaCategoria = element.preferencia;
                  this.prodsArray[a].dispCategoria = element.activo;
                  
                } 
            }
            
          });
          this.prodsArray.sort(function (a, b) {
            if (a.preferenciaCategoria > b.preferenciaCategoria) {
              return 1;  
            }
            if (a.preferenciaCategoria < b.preferenciaCategoria) {
              return -1;
            }
            return 0;
          });
          this.controlarVisibilidad();    
      });
      
  }

  controlarVisibilidad(){ //Controlamos que botones son accesibles dependiendo de si su categoría es visible
    for(let a=0;a<this.prodsArray.length;a++){
      if(this.prodsArray[a].dispCategoria == "false"){
        let x = document.getElementById(this.prodsArray[a].id);
        x.style.display="none";
      }else{
        let x = document.getElementById(this.prodsArray[a].id);
        x.style.removeProperty( 'display' );
      }
    }
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
    this.controlEncargos = false;
    this.controlEncargoAll = null;
    this.controlEncargoId = null;
    this.calculartotal();
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
      this.db.doc(this.userdata.nombre +'/datos/encargos/'+this.controlEncargoAll.id).update(JSON.parse(JSON.stringify(this.controlEncargoAll)));
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
          this.vaciarCarrito();
        }
      });
      return await modalEncargo.present();
      }
    }
  }

 
  verEncargos(){ // ir a pagina de encargos
    this.vaciarCarrito();
    this.router.navigateByUrl('/encargos')
  }

  verVentas(){ // ir a pagina de ventas
    this.vaciarCarrito();
    this.router.navigateByUrl('/ventas');
  }

  verProductos() {
    this.vaciarCarrito();
    this.router.navigateByUrl('/productos');
  }

  verCategorias() {
    this.vaciarCarrito();
    this.router.navigateByUrl('/categorias');
  }

 async nuevaVenta() { //Saca por pantalla un alert para seleccionar el metodo de pago
    if(this.carritodata.length > 0){

      const alert = await this.alertController.create({
        
        header:'Metodo de Pago',
        mode:'ios',
        inputs: [
          {
            name: 'Efectivo',
            type: 'radio',
            label: 'Efectivo',
            value: 'Efectivo',
            checked: true
          },
          {
            name: 'Tarjeta',
            type: 'radio',
            label: 'Tarjeta',
            value: 'Tarjeta'
          },
        ],
         buttons: [
              {
                text: 'Cancelar',
              }, 
              {
                text: 'Aceptar',
                handler: (alertData) => { 
                     this.metodoPago = alertData;
                      this.realizarVenta();
                }
              }
            ]
    });
      await alert.present();    
    }
  }

  realizarVenta(){

   let venta =  new ventasClass();
   venta.id = this.db.createId();
   venta.fecha = new Date().toLocaleDateString();
   venta.hora = new Date().toLocaleTimeString();
   let horas = venta.hora.split(":");
   venta.hora = horas[0]+":"+horas[1];
   venta.metodoPago = this.metodoPago;
   venta.productos = this.carritodata;
   venta.timestamp = new Date().getTime();

     if (this.controlEncargoAll != null){
      venta.nombreCliente = this.controlEncargoAll.cliente;
      this.db.doc(this.userdata.nombre +'/datos/encargos/' + this.controlEncargoId).delete();
    }else{
      venta.nombreCliente ="Venta Tienda";
    }

    this.db.doc(this.userdata.nombre +'/datos/ventas/' + venta.id).set(JSON.parse(JSON.stringify(venta)));

    this.vaciarCarrito();
  }

}
