import React from 'react'
import Navbar from './navbar.jsx'
import './credit.css';
import DynamicForm from './DynamicForm';
import {auth, db} from "./firebase.jsx";
import { getDatabase, ref, push, get, child, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ConstructionOutlined } from '@mui/icons-material';


var members = {}

            
class readDB extends React.Component{
    state = {
        data: [
            { name:"Auejin", point:0},
            { name:"Yeonsu", point: 0},
            { name:"Seonghye", point:0}
          ],
        test:[],
        team1:[
            {credit:0},
            {name:"Auejin", point:10},
            { name:"Yeonsu", point: 0},
            { name:"Seonghye", point:0}
        ],
        pastteams:[]
    }

    dbRead = (e) => {
        const auth = getAuth();
        const dbRef = ref(getDatabase()); 
        onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            //read db
            get(child(dbRef, 'users/' + uid + "/" + auth.currentUser.displayName + "/classes")).then((snapshot) => {
                if (snapshot.exists()) {
                    //console.log(snapshot.val())
                    this.setState({
                        test:[snapshot.val()]
                    })
                    //console.log("hello" + this.state.test)
                }
                else {
                    console.log("no data");
                }
            }).catch((error) => {
                console.error(error);
            });
        
         //get past teams 
            get(child(dbRef, 'users/' + uid + "/" + auth.currentUser.displayName + '/pastteams')).then((snapshot) => {
                if (snapshot.exists()){
                    //alert("copying pastteams to past")
                    this.setState({
                        //copy to pastteams
                        pastteams: [snapshot.val()]
                    })
                    console.log(this.state.pastteams)

                } else{
                    //add in data
                    alert("no data, pushing dummy data ")
                    push(ref(db, 'users/' + uid + "/" + auth.currentUser.displayName + '/pastteams/CS101'),
                     {
                        "credits": "0",
                        "Auejin": "10",
                        "Yeonsu": "20",
                        "Seonghye": "70"
                    
                    });}
            })}
    // ...
        else {
        alert("not signed in")
        // User is signed out
         // ...
        };
    }); }


    onSubmit = (model) =>{
        alert(JSON.stringify(model));
        this.setState({
            data:[model, ...this.state.data]
        })
    }

    render(){
        this.dbRead()
    return(
        <><div>
            <Navbar />
        </div>
        <div>
        
            <DynamicForm className = "form"
                title = "Credit"
                model = {[
                    {key:"auejin", label:this.state.data[0].name, type: "number", props: {min:0, max:100, required:true}},
                    {key:"yeonsu", label:"Yeonsu", type: "number", props: {min:0, max:100,required:true}},
                    {key:"seonghye", label:"Seonghye", type: "number", props: {min:0, max:100,required:true}}
                ]}
                onSubmit = {(model) => {this.onSubmit(model)}}
            />
      

            <pre style ={{width:"100"}}>
                {/*{JSON.stringify(this.state.test)}
                {JSON.stringify(this.model)}*/}
                {JSON.stringify(this.state.data)}
            </pre>
            
        </div>
{/*     
        <div className = "credit">
        <table>
        <tr>
          <th>Members</th>
          <th>Points</th>
        </tr>
        {data.map((val, key) => {
          return (
            <tr key={key}>
              <td>{val.name}</td>
              <td><form>
                <label>{val.name}
                    <NameForm/>
                    <input type="number" onChange="" placeholder="0" />
                </label>
                </form>
     </td>
            </tr>
          )
        })}
      </table>
            </div>
            */}
        
</>
   );

}}
export default readDB