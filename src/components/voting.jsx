import { auth, db } from "./firebase.jsx";
import { getDatabase, ref, get, child, set } from "firebase/database";
import { useState } from "react";

//* storeTeamInDB
function storeTeamInDB(course, userarr){
  const dbRef = ref(getDatabase());

  get(child(dbRef, 'users/')).then((snapshot) => {
    if(snapshot.exists()) {
      const username = userarr.map(user => Object.keys(snapshot.child('/'+user+'/').val())[0]);
      // console.log("username: ", username, userarr);
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
        // console.log("data: ", userarr2, userarr2, username, username2);
        const data2 = userarr2.map((user, i) => {
          return({
            name: username2[i],
            id: user
          })
        })
        // console.log("data2: ", 'users/' + user + '/' + username[index] + "/current_teams/" + course + "/");
        set(ref(db, 'users/' + user + '/' + username[index] + "/current_teams/" + course + "/"), data2); /// store current team in DB
      });
    }
  });
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
          /// goto Active Team page
          window.location.href = "/mypage";
        }

        if(vote && room.users.includes(auth.currentUser.uid)) { /// +1 to room.vote.accept if user voted as 'true'
          set(ref(db, route + index + '/vote/accept/'), curracceptance + 1);
          if((curracceptance+1)/total >= 2/3) { /// if 2/3 of team members agree, finalize the team with this members!
            storeTeamInDB(course, room.users);
            // console.log("aft: ", (curracceptance + 1)/total);
            /// goto Active Team page
            window.location.href = "/mypage";
          }
        }
        else{
          console.log("not in this room: ", room.users, auth.currentUser.uid);
        }
      });
      /// store the current team in the DB goto quizinfo page of next round
      const nextRound = parseInt(round) + 1;
      window.location.href = "/quizinfo/" + course + "/" + nextRound;
    }
  });

  // if(vote){
  //   //TODO: store the current team in DB
    

  //   get(child(dbRef, route)).then((snapshot) => {
  //     if(snapshot.exists()) {
  //       snapshot.val().map((room, index)=>{
  //         if(room.users.includes(auth.currentUser.uid)) {
  //           set(ref(db, route + index + '/vote/accept/'), parseInt(room.vote.accept) + 1);
  //           if((parseInt(room.vote.accept) + 1)/parseInt(room.vote.total) >= 2/3) setAcceptance(true);
  //         }
  //         else{
  //           console.log("not in this room: ", room.users, auth.currentUser.uid);
  //         }
  //       })
  //     }
  //     else{
  //       alert("something is wrong"); // TODO go out to the main page
  //     }
  //   });

    /// goto Active Team page
    // window.location.href = "/mypage"; //TODO
  // }
  // else{
    /// store the current team in the DB goto quizinfo page of next round
    // const nextRound = parseInt(round) + 1;
    // window.location.href = "/quizinfo/" + course + "/" + nextRound;
  // }
}

//* Voting 
function Voting(props) {
  const course = props.course; 
  const round = props.round;
  const totalrounds = 3; // TODO: connect to quizinfo page
  const leftchances = totalrounds - round + 1;

  if(leftchances == 0) {
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
      <div>
        Discussion Time has Passed!
      </div>
      <div>
        Do you want to make team with current members?
      </div>
      <button onClick={() => handleVoting(true, course, round)}>Yes</button>
      <button onClick={() => handleVoting(false, course, round)}>Try Again ({leftchances}/{totalrounds})</button>
    </div>
  )
}

export default Voting;
