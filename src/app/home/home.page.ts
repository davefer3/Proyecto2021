import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  correo:string;
  passw:string;

  constructor(
    private router:Router,
    private db:AngularFirestore, 
    private afAuth:AngularFireAuth,
  ) {


    //Comprobación sesión iniciada al arrancar app//
    if(localStorage.getItem("usuario")!=null){
      this.router.navigateByUrl("/principal");
    }

  }

// INICIO DE SESIÓN ON CLICK BOTÓN //
  iniciarSesion(){
    return this.afAuth.signInWithEmailAndPassword(this.correo,this.passw)
      .then((newCredential:firebase.default.auth.UserCredential)=>
      {   
        let usersCollection:AngularFirestoreCollection = this.db.collection("usuarios");
        usersCollection.valueChanges().subscribe(

            res=>{
              res.forEach(element=>{
                if(element.correo == this.correo){
                    localStorage.setItem("usuario",JSON.stringify(element));
                    this.router.navigateByUrl("/principal");
                }
              })
            }
        )
      })
      .catch(error=>
        {
          console.log(error);
        });

  }
// ----------------------------------- //





}
