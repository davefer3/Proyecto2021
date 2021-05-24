import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.page.html',
  styleUrls: ['./ofertas.page.scss'],
})
export class OfertasPage {

  userdata:any = [];
  ofertas: any = [];

  constructor(
    private router:Router,
    private db:AngularFirestore,
    ) {
      this.userdata = JSON.parse(localStorage.getItem("usuario"));
      this.cargarOfertas();

    }


  cargarOfertas(){
    this.ofertas = [];
    let ofertasCollection:AngularFirestoreCollection = this.db.collection(this.userdata.nombre+'/datos/ofertas/');
        ofertasCollection.valueChanges().subscribe(
          res =>{
            this.ofertas = [];
            res.forEach(element =>{
              this.ofertas.push(element);
            })
          
            this.ofertas.sort(function(a,b){
              return a.idprod - b.idprod;
            })
            
          })

  } 

  cambioEstadoOferta(event) {
    console.log(event.detail.checked);
    console.log(event.srcElement.id);
  }

  borrarOferta(oferta) {
    console.log("borrador")
  }

  nuevaOferta(oferta) {
    console.log("añadir")
  }

  editarOferta(oferta) {
    console.log("editor")
  }

  volver(){ //vuelve a la pagina principal
    this.router.navigateByUrl('/principal');
  }

}
