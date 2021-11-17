import React, {Component} from 'react';
import {auth} from "./firebase.jsx";
import { getDatabase, ref, get, child } from "firebase/database";
import PROFILE1 from "../images/Level1.png"
import PROFILE2 from "../images/Level2.png"
import PROFILE3 from "../images/Level3.png"
import PROFILE4 from "../images/Level4.png"
import PROFILE5 from "../images/Level5.png"
import "./profile.css"

export class profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      credit: 0,
      level: 0,
      picture: null
    }
  }

componentDidMount() {
  auth.onAuthStateChanged(user => {
    this.setState({ currentUser: user });
  })
}

user_credit() {
  const dbRef = ref(getDatabase());
  // set(child(dbRef, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/totalcredit/' + 'credit'), 400);
  get(child(dbRef, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/totalcredit/')).then((snapshot) => {
      if (snapshot.exists()) {
        this.setState({ credit: Object.values(snapshot.val()) });
        if (this.state.credit < 100) {
          this.setState({picture: PROFILE1});
          this.setState({level: 1});
        }
        else if ((this.state.credit < 200) && (this.state.credit >= 100)) {
          this.setState({ picture: PROFILE2});
          this.setState({level: 2});
        }
        else if ((this.state.credit < 300) && (this.state.credit >= 200)) {
          this.setState({ picture: PROFILE3});
          this.setState({level: 3});
        }
        else if ((this.state.credit < 400) && (this.state.credit >= 300)) {
          this.setState({ picture: PROFILE4});
          this.setState({level: 4});
        }
        else if ((this.state.credit >= 400)) {
          this.setState({ picture: PROFILE5});
          this.setState({level: 5});
        }
      }
      else {
        this.setState({picture: PROFILE1});
        this.setState({level: 1});
      }
  }) ;
}

    render() {
      if (this.state.currentUser === null) {
        return (<div>Please sign-in to see your profile</div>)
      }
      else {
        const user_name = this.state.currentUser.displayName;
        const user_email = this.state.currentUser.email;
        this.user_credit();
        return (
          <div>
            {this.user_credit()}
            <table style={{border: 0, alignContent: "right"}} className="table_settingsetting">
              <tr>
                <td style={{border: 0, width: "250px",textAlign: "right"}}>
                  <img src = {this.state.picture} alt="" style={{height:"250px", width:"auto", border:"1px solid black"}} />
                </td>
                <td style={{border: 0,textAlign: "left"}} className="profile_info">
                  <div className="profile_name">
                  {user_name} <br/>
                  </div>
                  <tr>
                    <td style={{border: 0,textAlign: "right", paddingRight: "10px"}} >Email:<br/>Credit:</td>
                    <td style={{border: 0,textAlign: "left",}}>{user_email}<br/>{this.state.credit}</td>
                  </tr>
                   <br/>
                  <div className="level">You are <b>level {this.state.level}</b> Nubjuki!</div>
                </td>
                <td style={{borderLeft: "1px solid black", height: "calc(100vh - 175px)"}}>
                  <tr>
                    <td>
                    <img src = {PROFILE1} alt="" style={{height:"70px", width:"auto", border:"1px solid black"}} className="levels_nubjuk"/>
                    </td>
                    <td className="level_description">
                      <b>Level 1</b><br/>
                      Newcomer
                    </td>
                  </tr>                
                  <tr>
                    <td>
                    <img src = {PROFILE2} alt="" style={{height:"70px", width:"auto", border:"1px solid black"}} className="levels_nubjuk"/>
                    </td>
                    <td className="level_description">
                      <b>Level 2</b><br/>
                      Hard-Worker
                    </td>
                  </tr>       
                  <tr>
                    <td>
                    <img src = {PROFILE3} alt="" style={{height:"70px", width:"auto", border:"1px solid black"}} className="levels_nubjuk"/>
                    </td>
                    <td className="level_description">
                      <b>Level 3</b><br/>
                      Average Worker
                    </td>
                  </tr>       
                  <tr>
                    <td>
                    <img src = {PROFILE4} alt="" style={{height:"70px", width:"auto", border:"1px solid black"}} className="levels_nubjuk"/>
                    </td>
                    <td className="level_description">
                      <b>Level 4</b><br/>
                      Proficient Worker
                    </td>
                  </tr>       
                  <tr>
                    <td>
                    <img src = {PROFILE5} alt="" style={{height:"70px", width:"auto", border:"1px solid black"}} className="levels_nubjuk1"/>
                    </td>
                    <td className="level_description">
                      <b>Level 5</b><br/>
                      Teamwork Master
                    </td>
                  </tr>       
                </td>
              </tr>
              
            </table>

            

          </div> 
        )
      }
    }
  }

export default profile