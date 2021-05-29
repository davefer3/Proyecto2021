import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { VentasModalPage } from '../ventas-modal/ventas-modal.page';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage  {

  controladorVisualFiltros:boolean = true;
  controladorIconoFiltros:string ="chevron-forward-outline";

  userdata:any=[];

  ventas:any=[];
  ventasaux:any=[];
  ventasaux2:any=[];
  totalventas:any;

  opcionSelected:String ="Todo";
  opcion2Selected:String = "Todo";
  opciones:any=["Productos","Metodo de pago"];
  opcionesSecundarias:any=[];
  opcionespago:any=["Efectivo","Tarjeta"];
  opcionesproductos:any=[];

  fechainicio:any;
  fechafin:any;

  constructor(
    private router:Router,
    private db:AngularFirestore,
    private modalController:ModalController,
    ) {
    this.userdata = JSON.parse(localStorage.getItem("usuario"));

    let f = new Date();
    this.fechainicio = new Date(f).toLocaleDateString();

    this.cargarVentas();
    this.cargarProductos();

    
  }

  ionViewDidEnter(){
    document.getElementById("fechainicio").shadowRoot.textContent=this.fechainicio;
  }
  
  volver(){ //vuelve a la pagina principal
    this.router.navigateByUrl('/principal');
  }

  contarTotalVentas(){
    this.totalventas = this.ventas.length
  }

  cargarVentas(){ // Recoje las ventas de la bdd dependiendo de las fechas
    let ventasCollection:AngularFirestoreCollection = this.db.collection(this.userdata.nombre + '/datos/ventas/');
    ventasCollection.valueChanges().subscribe(
      res =>{
        this.ventas =[];
    
        res.forEach(element => {
            if(element.fecha.split("/")[2] >= this.fechainicio.split("/")[2]){
        
              if(element.fecha.split("/")[1] > this.fechainicio.split("/")[1]){
                this.ventas.push(element);
              }
              if(element.fecha.split("/")[1] == this.fechainicio.split("/")[1]){
  
                if(element.fecha.split("/")[0] >= this.fechainicio.split("/")[0]){
                  this.ventas.push(element);
                }
              }
            }
        });
          this.ventasaux = this.ventas;
          this.ventasaux2 = this.ventas;
          this.contarTotalVentas();
      });

  }

  

  verFiltros(){ //Hace in/visible los filtros de busqueda
    if(this.controladorVisualFiltros == true){
      this.controladorVisualFiltros = false;
      this.controladorIconoFiltros = "chevron-down-outline"
    }else{
      this.controladorVisualFiltros = true;
      this.controladorIconoFiltros = "chevron-forward-outline"
    }
  }

  cargarProductos(){ //Carga los productos
    let productosCollection2:AngularFirestoreCollection = this.db.collection(this.userdata.nombre+'/datos/productos/');
    productosCollection2.valueChanges().subscribe(     
      res=>{
        this.opcionesproductos =[];
        res.forEach(element =>{
          this.opcionesproductos.push(element.nombre);
        })
  })
}


  cambioOptionPrincipal(event){
    this.opcionesSecundarias = [];
    this.opcionSelected = event.srcElement.value;
    

    if(event.srcElement.value == "Metodo de pago"){
      this.opcionesSecundarias = this.opcionespago;
      
    }

    if(event.srcElement.value == "Productos"){
      this.opcionesSecundarias = this.opcionesproductos;
    }

    if(event.srcElement.value == "Todo"){
      this.ventas = this.ventasaux2;
      this.opcionesSecundarias = [];
    }
    this.contarTotalVentas();
  }
  
  cambioOptionSecundaria(event){
    this.ventas =[];
    this.opcion2Selected = event.srcElement.value;
    //Metodo de pagho
    if(this.opcionSelected == "Metodo de pago"){
      
      if(this.opcion2Selected != "Todo"){
        console.log("no es")
        for(let a=0;a<this.ventasaux2.length;a++){
          if(this.opcion2Selected == this.ventasaux2[a].metodoPago){
            this.ventas.push(this.ventasaux2[a]);
          }
        }
      }else{
        this.ventas = this.ventasaux2;
      }
    }
    //----

    //Producto
    if(this.opcionSelected == "Productos"){
      
      if(this.opcion2Selected != "Todo"){
        console.log("no es")
        for(let a=0;a<this.ventasaux2.length;a++){
          for(let e=0;e<this.ventasaux2[a].productos.length;e++){
            if(this.opcion2Selected == this.ventasaux2[a].productos[e].nombre){
              this.ventas.push(this.ventasaux2[a]);
            }
          }
        }
      }else{
        this.ventas = this.ventasaux2;
      }
    }
    //-----
    this.contarTotalVentas();
  }

  cambioFechaInicio(event){
    this.fechainicio = new Date(event.detail.value).toLocaleDateString();
    document.getElementById("fechainicio").shadowRoot.textContent=this.fechainicio;
    
    document.getElementById("fechafin").shadowRoot.textContent="cambiar";
    this.fechafin = null;

    this.cargarVentas();

  }

  cambioFechaFin(event){

    this.fechafin = new Date(event.detail.value).toLocaleDateString();
    document.getElementById("fechafin").shadowRoot.textContent=this.fechafin;
    this.ventas=[];
    this.ventasaux.forEach(element => {
      if(element.fecha.split("/")[2] <= this.fechafin.split("/")[2]){
        
        if(element.fecha.split("/")[1] < this.fechafin.split("/")[1]){
          this.ventas.push(element);
        }
        if(element.fecha.split("/")[1] == this.fechafin.split("/")[1]){

          if(element.fecha.split("/")[0] <= this.fechafin.split("/")[0]){
            this.ventas.push(element);
          }
        }
      }
    });
    this.ventasaux2 = this.ventas;
    this.contarTotalVentas();
  }

  resetarFechas(){
    this.opcionSelected="Todo";
    this.opcion2Selected="Todo";
    this.opcionesSecundarias=[];

    let f = new Date();
    this.fechainicio = new Date(f).toLocaleDateString();

    document.getElementById("fechainicio").shadowRoot.textContent=this.fechainicio;
    document.getElementById("fechafin").shadowRoot.textContent="cambiar";
    
    this.fechafin = null;

    

    this.cargarVentas();
   

  }

  async verVenta(venta){
    
    const modalEncargo = await this.modalController.create({
      component:VentasModalPage,
      cssClass:'productos-modal2',
      componentProps:{
        'venta':venta
      },
      backdropDismiss: true,
    });
    modalEncargo.onDidDismiss().then(data=>{
      
    });
    
    return await modalEncargo.present();
  }

}


