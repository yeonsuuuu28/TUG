import React, {Component} from 'react'
import Navbar from './navbar.jsx'
import {auth, db} from "./firebase.jsx";
import { getDatabase, ref, push, get, child, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./join_class.css";
import classes from "./classes_list.jsx";


const getclasses = () => {
    const dbRef = ref(getDatabase());
    for (let i=0; i<classes.length; i++) {
        get(child(dbRef, 'classes/')).then((snapshot) => {
            if(snapshot.exists()) {
                if (!(Object.keys(snapshot.val()).includes(classes[i].code))) {
                    set(ref(db, 'classes/' + classes[i].code + "/professor/"), classes[i].professor)
                    set(ref(db, 'classes/' + classes[i].code + "/name/"), classes[i].name)
                }
                else {
                }
            }
            else {
                set(ref(db, 'classes/' + classes[i].code + "/professor/"), classes[i].professor)
                set(ref(db, 'classes/' + classes[i].code + "/name/"), classes[i].name)
            }
        });
    }
}


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

        get(child(dbRef, 'classes/' + e + '/user/')).then((snapshot) => {
          if(snapshot.exists()) {
            if (!(Object.keys(snapshot.val()).includes(auth.currentUser.uid))) {
            //   alert("Successfully joined into the class!");
              set(ref(db, 'classes/' + e + '/user/' + auth.currentUser.uid + '/joined/'), "yes");
            }
            else {
            //   alert("Already joined the class");
            }
          }
          else {
            set(ref(db, 'classes/' + e + '/user/' + auth.currentUser.uid + '/joined/'), "yes");
            // alert("Successfully joined into the class!");
          }
        });
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
            {getclasses()}
            <div className="join_title">Join Your Class</div>
            <div onClick = {() => {this.classes("CS473")}}>Introduction to Social Computing</div>
            <br/>
            <div onClick = {() => {this.classes("CS300")}}>Introduction to Algorithms</div>
            <br/>
            <div onClick = {() => {this.classes("CS101")}}>Introduction to Programming</div>
            <br/>
            <div onClick = {() => {this.classes("CS350")}}>Introduction to Software Engineering</div>
            </div>
        )
    }

}

export default join