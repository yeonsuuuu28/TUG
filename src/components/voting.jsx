import { auth, db } from "./firebase.jsx";
import { getDatabase, ref, get, child, set } from "firebase/database";
// import { useState } from "react";
// import { AppPlatform } from "firebase-admin/lib/project-management/app-metadata";
import "./voting.css"


//* storeTeamInDB
function storeTeamInDB(course, userarr){
  const dbRef = ref(getDatabase());

  get(child(dbRef, 'users/')).then((snapshot) => {
    if(snapshot.exists()) {
      const username = userarr.map(user => Object.keys(snapshot.child('/'+user+'/').val())[0]);
      const emails = userarr.map((user, index) => snapshot.child('/'+user+'/'+username[index] + '/email/').val());
      // console.log("emails: ", username, userarr, emails);
      userarr.forEach((user,index) => {
        // const username = Object.keys(snapshot.child('/'+user+'/').val())[0];
        // console.log("lastpang: ", Object.keys(snapshot.child('/'+user+'/').val()));
        /// relocate user at the first element
        const userarr2 = userarr.slice();
        userarr2.splice(index - userarr.length, 1);
        userarr2.splice(0, 0, user); 
        const username2 = username.slice();
        username2.splice(index - username.length, 1);
        username2.splice(0,0,username[index]);
        const emails2 = emails.slice();
        emails2.splice(index - emails.length, 1);
        emails2.splice(0,0,emails[index]);
                // console.log("data: ", userarr2, userarr2, username, username2);
        const data2 = userarr2.map((user, i) => {
          return({
            name: username2[i],
            id: user,
            email: emails2[i]
          })
        })
        console.log("data2: ", 'users/' + user + '/' + username[index] + "/current_teams/" + course + "/", data2);
        set(ref(db, 'users/' + user + '/' + username[index] + "/current_teams/" + course + "/"), data2); /// store current team in DB
        set(ref(db, 'classes/' + course + '/user/' + user + "/finished/"), 'yes');
        set(ref(db, "users/" + user + '/' + username[index] + "/teambuilding/"), null);
      });
    }
  });
}


//* voteResult - return the html of the vote result and redirect to next page
function voteResult(formed, course, round){
  if(formed === true) { /// goto Active Team page
    alert("Your team is formed! ^V^\nmore than 2/3 of your teammates agreed to be in this team! :)");
    window.location.href = "/mypage";
  }
  else if(formed === false){ /// store the current team in the DB goto quizinfo page of next round
    if(alert("Less than 2/3 of your teammates agreed to be in this team :(\n Let's go to the next round! :)"));
    const nextRound = parseInt(round) + 1;
    window.location.href = "/quizinfo/" + course + "/" + nextRound;
  }
}

//* handleVoting
/// input: vote - true if the user clicks 'Yes', false if the user clicks 'Try Again'
function handleVoting(vote, course, round){
  const dbRef = ref(getDatabase());
  // const route = 'rooms/' + course + "/"; //TODO
  const route = 'classes/' + course + '/rooms/';

  get(child(dbRef, route)).then((snapshot) => {
    if(snapshot.exists()) {
      snapshot.val().map((room, index)=>{
        const curracceptance = parseInt(room.vote.accept);
        const total = parseInt(room.vote.total);
        // console.log("curr: ", curracceptance/total);
        if((curracceptance/total) >= 2/3) { /// if 2/3 of team members agree, finalize the team with this members!
          storeTeamInDB(course, room.users);
          return voteResult(true, course, round);
        }
        else if((curracceptance/total) < 2/3 && !vote){
          // console.log("dkdk",curracceptance/total);
          return voteResult(false, course, round);
        }
        else if(vote && room.users.includes(auth.currentUser.uid)) { /// +1 to room.vote.accept if user voted as 'true'
          set(ref(db, route + index + '/vote/accept/'), curracceptance + 1);
          if((curracceptance+1)/total >= 2/3) { /// if 2/3 of team members agree, finalize the team with this members!
            storeTeamInDB(course, room.users);
            // console.log("aft: ", (curracceptance + 1)/total);
            return voteResult(true, course, round);
          }
          else{
            // console.log("d2222kdk",curracceptance/total);
            return voteResult(false, course, round);
          }
        }
        else{
          console.log("not in this room: ", room.users, auth.currentUser.uid);
          return(<></>);
        }
      });
    }
  });
}

//* Voting 
function Voting(props) {
  const course = props.course; 
  const round = props.round;
  const totalrounds = 3; // TODO: connect to quizinfo page
  const leftchances = totalrounds - round + 1;

  if(leftchances === 0) {
    return(
      <div className="popup">
      <div>
        There is no left chances for quiz!
      </div>
      <div>
        Now you can check your new team at 'Active Team' bar of mypage. Have a good luck on your team project!
      </div>
      <button onClick={() => handleVoting(true, course, round)}>Go to Active Team</button>
    </div>
    )
  }

  return(
    <div className="popup">
      <div style={{textAlign: "center", fontFamily: "Lato", fontSize: "17pt", paddingTop: "190px", fontWeight: "bold", paddingBottom: "20px"}}>
        Discussion Time has Passed!
      </div>
      <div style={{textAlign: "center", fontFamily: "Lato", fontSize: "12pt"}}>
        Do you want to make team with current members?
      </div>
      <div>
        <span className="button30" onClick={() => handleVoting(true, course, round)}>Yes</span>
        <span className="button31" onClick={() => handleVoting(false, course, round)}>Try Again ({leftchances}/{totalrounds})</span>
      </div>
    </div>
  )
}

export default Voting;
