import React, {Component} from 'react'
import Navbar from './navbar.jsx'
import {auth, db} from "./firebase.jsx";
import { getDatabase, ref, push, get, child } from "firebase/database";

//* JUST COPY&PASTED from join_class.jsx.  Should be coded later!! 

class start_team_building extends Component {

    constructor(props) { //TODO 
        super(props);
        this.state = {
            class: []
        }
    }

    dbAdd = (e) => {
        const dbRef = ref(getDatabase());
            get(child(dbRef, 'classes/' + e + '/user/' + auth.currentUser.uid + '/')).then((snapshot) => {
              if(snapshot.exists()) {
                  alert("Success!!!!");
                  //TODO erase update import!!!
                  set(ref(db, 'classes/' + e + '/user/' + auth.currentUser.uid + '/' + 'answers' + '/answer1/'), 2);
              }
              else{
                console.log(snapshot.val());
              }
            });
    }

    classes = (x) => {
        if (auth.currentUser === null){
            alert("Sign in to join class")
        }
        else {
            this.dbAdd(x)
            };
        }


    render(){
        return (
            <div>
            <Navbar/>

            <br/>
            <div onClick = {() => {this.classes("CS473")}}>Introduction to Social Computing</div>
            <br/>
            <div onClick = {() => {this.classes("CS300")}}>Introduction to Algorithms</div>
            <br/>
            <div onClick = {() => {this.classes("CS101")}}>Introduction to Programming</div>
            </div>
        )
    }

}

export default start_team_building
