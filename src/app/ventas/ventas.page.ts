import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage  {

  controladorVisualFiltros:boolean = true;
  controladorIconoBusqueda:string ="chevron-forward-outline";
  
  productos:any=[];
  pagos:any=["Efectivo","Tarjeta"];
  opciones:any=["producto","metodo de pago"]

  seleccion2:any = this.opciones
  seleccion:any=[];
  seleccionAux:string="todo";

  ventas:any=[];
  ventasAux:any=[];
  totalventas:number=0;

  userdata:any=[];

  fechaAuxInicio:string;
  fechaAuxFin:string;
  fechaInicio:string;
  fechaFin:string;


  

  constructor(
    private router:Router,
    private db:AngularFirestore,
    ) {
    this.userdata = JSON.parse(localStorage.getItem("usuario"));
    this.setfecha();
    
    this.consultarFechaVentas();
    this.productosSelect();
  }
  
  setfecha(){ //Coloca la fecha de los encargos a visualizar en el día actual
    this.fechaAuxInicio = new Date().toString();
    this.fechaInicio = new Date(this.fechaAuxInicio).toLocaleDateString();

    this.fechaAuxFin = new Date().toString();
    this.fechaFin = new Date(this.fechaFin).toLocaleDateString();
  }

  onChange(event){
    if(event.srcElement.id == "finicio"){
      this.fechaInicio = new Date(event.detail.value).toLocaleDateString();
    }else{
      this.fechaFin = new Date(event.detail.value).toLocaleDateString();
    }
    this.consultarFechaVentas();
  }

  cambioCat(event){
    console.log(event.srcElement.value);

    if(event.srcElement.value == "producto"){
      this.seleccion = this.productos;
      this.seleccionAux = event.srcElement.value
    }

    if(event.srcElement.value == "metodo de pago"){
      this.seleccion = this.pagos;
      this.seleccionAux = event.srcElement.value
    }

    if(event.srcElement.value == "todo"){
      this.seleccion = null;
      this.seleccionAux = event.srcElement.value
      this.ventas = this.ventasAux;
    }

  }

  cambioSubCat(event){
    console.log(event.srcElement.value);
    this.ventas = [];
    
   if(this.seleccionAux == "producto"){
    this.ventasAux.forEach(element => {
      element.productos.forEach(element2 => {
        if(element2.nombre == event.srcElement.value ){
          this.ventas.push(element);
      }
      });
    });
    this.contarTotalVentas();
   }

   if(this.seleccionAux == "metodo de pago"){
    this.ventasAux.forEach(element => {
        if(element.metodoPago == event.srcElement.value){
          this.ventas.push(element);
        }
    });
    this.contarTotalVentas();
   } 
   
   if(event.srcElement.value == "todo"){
          this.ventas = this.ventasAux;
          this.contarTotalVentas();
   } 
    
  }

  consultarFechaVentas(){ // Recoje las ventas de la bdd dependiendo de las fechas
    let ventasCollection:AngularFirestoreCollection = this.db.collection(this.userdata.nombre+'/datos/ventas/',ref => ref.where("fecha",">=",this.fechaInicio).where("fecha","<=",this.fechaFin))
    ventasCollection.valueChanges().subscribe(
      res =>{
        this.ventas = [];
        res.forEach(element=>{
          this.ventas.push(element);
        })
        this.ventasAux = this.ventas;
        this.seleccionAux= "todo"
        this.seleccion = [];
        this.seleccion2 = [];
        
        setTimeout(() => {
          this.seleccion2 = this.opciones
        }, 300);

        this.contarTotalVentas();
      })
  }

  productosSelect() { //Consulta la lista de productos y las coloca en el SELECT del filtro
    let prodsCollection:AngularFirestoreCollection = this.db.collection(this.userdata.nombre+'/datos/productos/')
    prodsCollection.valueChanges().subscribe(
      res =>{
        this.productos = [];
        res.forEach(element=>{
          this.productos.push(element.nombre);  
        })

      })
  }

  verFiltros(){ //Hace in/visible los filtros de busqueda
    if(this.controladorVisualFiltros == true){
      this.controladorVisualFiltros = false;
      this.controladorIconoBusqueda = "chevron-down-outline"
    }else{
      this.controladorVisualFiltros = true;
      this.controladorIconoBusqueda = "chevron-forward-outline"
    }
  }

  contarTotalVentas(){
    this.totalventas = this.ventas.length
    console.log(this.totalventas)
  }
  
  volver(){ //vuelve a la pagina principal
    this.router.navigateByUrl('/principal');
  }

  

}


