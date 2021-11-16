import React from 'react'
import Navbar from './navbar.jsx'
import './credit.css';
import DynamicForm from './DynamicForm';
import {auth, db} from "./firebase.jsx";
import { getDatabase, ref, get, child, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";


const members = [{}]
const update = [{}]
var isdbRead = false
const classid = "CS101"

            
class readDB extends React.Component{
    state = {
        data: [
            { name:"Auejin", point:0},
            { name:"Yeonsu", point: 0},
            { name:"Seonghye", point:0}
          ],
        pastteams:[], //snapshot of current team gets copied here
        userids:[],
        output:[]
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
                    //console.log("no data");
                }
            }).catch((error) => {
                console.error(error);
            });
        
         //get past teams 
            get(child(dbRef, 'users/' + uid + "/" + auth.currentUser.displayName + '/currentteams/' + classid)).then((snapshot) => {
                if (snapshot.exists()){
                    //alert("copying pastteams to past")
                    //const data1 = snapshot.val()
                    this.setState({
                        //copy to pastteams
                        pastteams: [snapshot.val()]
                    })
                    //alert("dbread")
                    //get data to database
                  //  console.log(this.state.pastteams[0][3].credit)

                } else{
                    //add in data
                    alert("no data, pushing dummy data ")
                    set(ref(db, 'users/' + uid + "/" + auth.currentUser.displayName + '/currentteams/' + classid),
                     [
                        {credits: "0"},
                        {name:"Auejin", credit:"10"},
                        {name:"Yeonsu", credit:"20"},
                        {name:"Seonghye", credit:"70"}
                    
                     ]);
                }
            }
            
            )
            //get all user ids
            get(child(dbRef, 'users')).then((snapshot) => {
                if (snapshot.exists()){
                    //alert("copying pastteams to past")
                    //const data1 = snapshot.val()
                    this.setState({
                        //copy to pastteams
                        userids: [snapshot.val()]
                    })
                    //get all users keys
                    console.log(Object.keys(this.state.userids[0]))

                    /*for (const i in Object.keys(this.state.userid[0])){
                        
                    }*/
                    


                } else{
                    
                }
            }
            
            
            )
        
        
        
        }
    // ...
        else {
        alert("not signed in")
        // User is signed out
         // ...
        };
    }); }

    fillModel = () =>{
        for (const i in this.state.pastteams[0]){
            if (Object.keys(this.state.pastteams[0][i]).includes("name")){
            members[i] = {"key":this.state.pastteams[0][i].name,"label":this.state.pastteams[0][i].name,"type":"number","props":"{min:0, max:100, required:true}"}
            }
        };
        delete members[0] //deletes the array made by "credits"
       // console.log(members)
    }

    getaverage = (e) => {
        
    }

    onSubmit = (model) =>{
        //alert(JSON.stringify(model[this.state.pastteams[0][1].name])); // displays points allocated for 1st person
        
        //debugging stuff
        /*this.setState({
            data:[model, ...this.state.data]
        })
        this.setState({
            output:[model]
        })
       
        alert(JSON.stringify(this.state.output[0]));
        console.log(this.state.pastteams[0][3].credit)
        */
       //redirect
        window.location.assign('./mypage')

        //write to db updated values
            //1.build items to be written in DB
        
        update[0] = {credits:0}
        
        for(const i in this.state.pastteams[0]){
            if (Object.keys(this.state.pastteams[0][i]).includes("name")){
                
                update[i] = {name:this.state.pastteams[0][i].name, credit:model[this.state.pastteams[0][i].name]}
            }
        }
        //console.log(update)
            //2.write to db
        set(ref(db, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/pastteams/' + classid),update);

        //delete /current teams + classid
        set(ref(db, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/currentteams/' + classid),null);

        alert("Thank you for submitting an honest review! Credits are now updated Successfully");
        
        //redirect to another page
    
        }



    render(){
        if (isdbRead === false){
            this.dbRead()
            this.fillModel()
        }
     
    return(
        <><div>
            <Navbar />
        </div>
        <div>
        
            <DynamicForm className = "form"
                title = "Credit"
                model = {members}
                /* sample structure of the model = members
                model = {[
                    {key:"auejin", label:this.state.data[0].name, type: "number", props: {min:0, max:100, required:true}},
                    {key:"yeonsu", label:"Yeonsu", type: "number", props: {min:0, max:100,required:true}},
                    {key:"seonghye", label:"Seonghye", type: "number", props: {min:0, max:100,required:true}}
                ]}
                */
                onSubmit = {(model) => {this.onSubmit(model)}}
            />
{/*}
            <pre style ={{width:"100"}}>
                {JSON.stringify(this.state.test)}
                {JSON.stringify(this.model)}
                Inputdata: {JSON.stringify(this.state.pastteams)}    
            </pre>

            <div>
                Output data: {JSON.stringify(this.state.output)}
            </div>  */}
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