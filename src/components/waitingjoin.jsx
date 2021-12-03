//* <WAiting Join page algorithm (before the 1st round quiz)>
//  let the class requires n teammates for each room. (n is usually 2 or 3 or 4)
///
/// 1. WAIT for 3 minutes (10 seconds for demo)
/// 2. after 3 minutes, 
///	  if ( the number of joined students >= 2*n){
///	    if ( every joined students submitted their profile ) {
///			  GO TO the quiz information page. 
///			  SET db(classes/[classID]/quizstarted) : 'yes'
///		  }
///		  else {
///			  WAIT until every joined students submit their profile
///		  }
///	  }
///	  else {
///		  WAIT until the number of joined students becomes 2*n or more
///	  }
///

import Navbar from "./navbar_quiz.jsx";
import React, { useState } from 'react'
import { db} from "./firebase.jsx";
import { getDatabase, ref, get, child, set } from "firebase/database";
import "./quizwaiting.css";
import classes from "./classes_list.jsx";
import {storeTeamInDB} from "./voting.jsx";

const timeInit = Date.now();

//* WaitingJoin - '/waitingjoin/:course/:round' page
/// if the user clicks 'MAKE TEAM' button at mypage-'Your Class', redirect to waitingjoin page.
/// wait for 3 mins to gather students or after 3 mins, wait until 4 students join to this class
function WaitingJoin(props) {
  const course = props.match.params.course;
  const round = parseInt(props.match.params.round);
  let timelimitsntnc = "3 minutes";
  let timelimit = round === 1 ? 3 * 60 * 1000 : 1 * 60 * 1000; // 3 minutes 
  let studlimit = 8;
  for(var i =0; i<classes.length; i++){ // set studlimit
    if(classes[i].code === course) {
      studlimit = classes[i].team * 2;
      break;
    }
  }

  //TODO: for debugging
  // studlimit = 1; //TODODODODODDODO
  timelimit = 10 * 1000; //TODODODODODODODO 10 seconds
  timelimitsntnc = "10 seconds"; //TODODODODOODOODO 10 seconds

  const dbRef = ref(getDatabase());
  const [startedStudents, setStartedStudents] = useState(0); // number of students who submitted the profile
  const [joinedStudents, setJoinedStudents] = useState(0); // number of students who joined the class
  const [sentence, setSentence] = useState(round === 1 ? "Let's wait for "+timelimitsntnc+"." : "");
  const [timeLeft, setTimeLeft] = useState('');
  const [userarr, setUserArr] = useState([]); // for round >= 2: set the left user list
  setTimeout(setTimeState, 1000);
  setTimeout(getJoinedStudents, 5000);

  /// return statement
  if(sentence === "Times Over! There is only one team left. Wish you have a nice teamwork!"){
    console.log("userarr: ", course, userarr);
    storeTeamInDB(course, userarr);
    setTimeout(function(){window.location.href = "/mypage"}, 3000);
    return;
  }

  //* setTimeState
  /// set the state 'timeLeft'
  function setTimeState() {
    var timeNow = Date.now();
    const left = timeNow - timeInit;
    let mins = Math.floor((timelimit - left) / (1000*60));
    let seconds = Math.floor((timelimit - left)/1000 - 60 * mins);
    // console.log(timeInit, timeNow, mins, seconds);
    if(mins < 0) { // time is over
      timeOut(); /// call timeOut function after 3 minutes
      if(round === 1) setInterval(getJoinedStudents, 5000);
    }
    else {
      if(seconds < 10) seconds = '0'+seconds;
      setTimeLeft(mins+':'+seconds)
    }
  }

  //* timeOut
  /// go to quizinfo page if 4 or more students joined in the class
  function timeOut() {
    if(round === 1 && joinedStudents < studlimit) { // joined students are less than the lower limit
      setSentence("Times over. But we need at least " + studlimit + " students to start the quiz. Waiting more..." );
    }
    else if(round === 1 && joinedStudents > startedStudents) { // there are some students who joined but haven't made profile yet
      setSentence("Times over. But there are " + (joinedStudents - startedStudents) + " students who have not made the profile yet😥 Please wait for them to submit.");
    }
    else if(round >= 2 && joinedStudents < studlimit){ // 
      // setTimeout(window.location.href = "/mypage", 3000);
      
      setSentence("Times Over! There is only one team left. Wish you have a nice teamwork!");
    }
    else{ /// go to next page
      const route = 'classes/' + course + '/quizstarted/'; // if 'quizstarted' == 'yes': cannot join the class. quiz is started with currently joined students
      set(ref(db, route), 'yes');
      window.location.href = "/quizinfo/"+course+'/' + round;
    }
  }

  //* getJoinedStudents
  /// get data of the number of joined students from DB and set the state 'joinedStudents' & 'startedStudents'
  function getJoinedStudents() {
    const route = '/classes/' + course;
    get(child(dbRef, route)).then((s) => {
      if(s.exists()){
        if(round === 1 && s.child('/quizstarted/').val() === 'yes'){ /// go to next page
          console.log("someone already started the quiz: ", s.child('/quizstarted/').val());
          window.location.href = "/quizinfo/"+course+'/1';
        }
        else if(round >= 2){ /// round >= 2: set userarr and joinedStudents
          let joined = 0;
          let userarr2 = [];
          Object.values(s.child('/user/').val()).map((obj, index) => {
            if(obj['finished'] === 'yes') {
              return(<></>)
            }
            else {
              userarr2.push(Object.keys(s.child('/user/').val())[index]);
              joined = joined + 1;
              return(<></>)
            }
          });
          if(timeLeft !== '0:00'){
            setUserArr(userarr2);
            setJoinedStudents(joined);
          }
        }
        else{ /// first start at round 1
          let ss = 0;
          Object.keys(s.child('/user/').val()).map((obj) => {
            if(s.child('/user/'+obj+'/profile/').val() === "yes"){ // count the students who submitted the profile
              ss = ss + 1;
            }
            return 0;
          });
          setStartedStudents(ss);
          setJoinedStudents(Object.keys(s.child('/user/').val()).length);
          console.log("currently joined students: ", joinedStudents);
          return(<></>)
        }
      }
      else{
        //TODO
      };
    });
  }

  if(round === 1){ /// 1st round: wait for join
    return(
      <div>
        <Navbar/>
        <div className="waiting_main_title">
          Waiting for Other Students to Join...
        </div>
        <div className="waiting_description_align">
        <div className="waiting_description">
          Please wait for your peers to join the class!<br/>
          Currently we have {joinedStudents} students joined :)<br/>
          {sentence}<br/>
        </div>
        <div className="waiting_number">
          <b>{timeLeft}</b>
        </div>
        </div>
      </div>
    );
  }
  else{ /// round >= 2: wait for vote
    return(
      <div>
        <Navbar/>
        <div className="waiting_main_title">
          Waiting for Other Students to Vote...
        </div>
        <div className="waiting_description_align">
        <div className="waiting_description">
          Please wait for your peers to finish the voting!<br/>
          Currently we have {joinedStudents} students joined :)<br/>
          {sentence}<br/>
        </div>
        <div className="waiting_number">
          <b>{timeLeft}</b>
        </div>
        </div>
      </div>
    );
  }
}

export default WaitingJoin;