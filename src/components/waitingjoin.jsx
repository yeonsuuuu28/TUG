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
  const timelimit = round === 1 ? 3 * 60 * 1000 : 0.2 * 60 * 1000; // 3 minutes //TODODODODODDODODODO
  let studlimit = 8;
  for(var i =0; i<classes.length; i++){ // set studlimit
    if(classes[i].code === course) {
      studlimit = classes[i].team * 2;
      break;
    }
  }
  const dbRef = ref(getDatabase());
  const [joinedStudents, setJoinedStudents] = useState(0);
  const [sentence, setSentence] = useState(round === 1 ? "Let's wait for 3 minutes." : "");
  const [timeLeft, setTimeLeft] = useState('');
  const [userarr, setUserArr] = useState([]); // for round >= 2: set the left user list
  setTimeout(setTimeState, 1000);
  setTimeout(getJoinedStudents, 5000);

  /// return statement
  if(sentence === "Times Over! There is only one team left. Wish you have a nice teamwork!"){
    console.log("userarr: ", course, userarr);
    storeTeamInDB(course, userarr);
    setTimeout(window.location.href = "/mypage", 3000);
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
    if(round === 1 && joinedStudents < studlimit) {
      setSentence("3 minutes over. But we need at least " + studlimit + " students to start the quiz.");
    }
    else if(round >= 2 && joinedStudents < studlimit){
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
  /// get data of the number of joined students from DB and set the state 'joinedStudents' 
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
          // console.log(s.child('/user/').val());
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
          if(timeLeft != '0:00'){
            setUserArr(userarr2);
            setJoinedStudents(joined);
          }
          
          // console.log("round ",round, " joined students: ", joinedStudents, userarr2);
        }
        else{ /// first start at round 1
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