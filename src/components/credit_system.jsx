import React,{ useState } from 'react'
import Navbar from './navbar.jsx'
import './credit.css';

//import {auth} from "./join_class.jsx"
//import {auth, db} from "./firebase.jsx";
import { getDatabase, ref, push, get, child, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";




const data = [
    { name: "Auejin", points: 0},
    { name: "Yeonsu", points: 0  },
    { name: "Seonghye", points: 0 },
  ]
var members = {}

function handleSubmit(e){
    e.preventDefault();
    console.log(members.class)
    console.log(data)
}

            
class readDB extends React.Component{

    dbRead = () => {
        const auth = getAuth();
        const dbRef = ref(getDatabase()); 
        onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            //read db
            get(child(dbRef, 'users/' + uid + "/" + auth.currentUser.displayName)).then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val())
                    members = snapshot.val()
                    }
                else {
                    console.log("no data");
                }
            }).catch((error) => {
                console.error(error);
            });}

        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        
    // ...
        else {
        alert("not signed in")
        // User is signed out
         // ...
        };
    }); }

    render(){
        this.dbRead()
    return(
        <><div>
            <Navbar />
        </div>
        <div>
                <span>Value: 100 </span>
        </div>
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
        <div className="form">
            <form onSubmit={handleSubmit}>
                <button type="submit">Submit</button>
            </form>
        </div>
</>
   );

}}
  

  class NameForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      alert('A name was submitted: ' + this.state.value);
      event.preventDefault();
    }

   
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }

/*// Creating a custom hook
function useInput(defaultValue) {
    const [value, setValue] = useState(defaultValue);
    function onChange(e) {
      setValue(e.target.value);
    }
    return {
      value,
      onChange,
    };
  }
*/
  



class Form extends React.Component {
    constructor() {
        super();
        this.state = {
            nameValue: '',
            ageValue: ''
        }
    }
    onChangeName(event) {
        this.setState({
            nameValue:event.target.value
        });

    }
    onChangeAge(event) {
        this.setState({
            ageValue: event.target.value
        });
    }
    showValue(){
        alert('name '+ this.state.nameValue + ' age: ' + this.state.ageValue)
    }
    render() {
        return (
            <form>
                <label>Name:
                    <input type="text" onChange={this.onChangeName.bind(this)}/>
                </label>
                <label>Age:
                    <input type="text" onChange={this.onChangeAge.bind(this)}/>
                </label>
                <input type="submit" value="Submit" onClick={this.showValue.bind(this)}/>
            </form>
);
}
}
export default readDB