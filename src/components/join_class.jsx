import React, {Component} from 'react'
import Navbar from './navbar.jsx'
import {auth, db} from "./firebase.jsx";
import { getDatabase, ref, push, get, child } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

class join extends Component {

    constructor(props) {
        super(props);
        this.userid = {
            id: ""
        }
    }
    
    uniqueID = () => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
              const uid = user.uid;
              this.userid = uid;
            }
        })
    }

    dbAdd = (e) => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/class/')).then((snapshot) => {
            if (snapshot.exists()) {
                if (!(Object.values(snapshot.val()).includes(e))) {
                    alert("Successfully joined");
                    push(ref(db, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/class/'), e)
                }
                else {
                    alert("Already joined")
                }
            }
            else {
                alert("Successfully joined");
                push(ref(db, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/class/'), e)
            }});
        
        ///////////// added by Seonghye ///////////////
        /// add 'classes' structure into database
        get(child(dbRef, 'classes/' + e)).then((snapshot) => {
          if(snapshot.exists()) {
            if (!(Object.values(snapshot.val()).includes(auth.currentUser.displayName))) {
              alert("Successfully joined into the class!");
              push(ref(db, 'classes/' + e + '/'), auth.currentUser.displayName);
            }
            else {
              alert("Already joined the class");
              push(ref(db, 'classes/' + e + '/' + auth.currentUser.displayName + '/'));

            }
          }
          else {
            push(ref(db, 'classes/' + e + '/'), auth.currentUser.displayName);
            alert("Successfully joined into the class!");
          }
        });
        ///////////// added by Seonghye ///////////////
      }

    classes = (x) => {
        this.uniqueID();
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

export default join