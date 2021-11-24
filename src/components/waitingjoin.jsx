import Navbar from "./navbar_quiz.jsx";
import React, { useState } from 'react'
import { db} from "./firebase.jsx";
import { getDatabase, ref, get, child, set } from "firebase/database";
import "./quizwaiting.css";

const timeInit = Date.now();

//* WaitingJoin - '/waitingjoin/:course/:round' page
/// if the user clicks 'MAKE TEAM' button at mypage-'Your Class', redirect to waitingjoin page.
/// wait for 3 mins to gather students or after 3 mins, wait until 4 students join to this class
function WaitingJoin(props) {
  const course = props.match.params.course;
  const timelimit = 3 * 60 * 1000; // 3 minutes
  const studlimit = 4; // 4 students 
  const dbRef = ref(getDatabase());
  const [joinedStudents, setJoinedStudents] = useState(0);
  const [sentence, setSentence] = useState("");
  const [timeLeft, setTimeLeft] = useState('');
  setTimeout(setTimeState, 1000);
  setTimeout(getJoinedStudents, 5000);

  //* setTimeLeft
  /// set the state 'timeLeft'
  function setTimeState() {
    var timeNow = Date.now();
    const left = timeNow - timeInit;
    const mins = Math.floor((timelimit - left) / (1000*60));
    const seconds = Math.floor((timelimit - left)/1000 - 60 * mins);
    console.log(timeInit, timeNow, mins, seconds);
    if(mins < 0) { // time is over
      timeOut(); /// call timeOut function after 3 minutes
      setInterval(getJoinedStudents, 5000);
    }
    else {
      setTimeLeft(mins+':'+seconds)
    }
  }

  //* timeOut
  /// go to quizinfo page if 4 or more students joined in the class
  function timeOut() {
    if(joinedStudents < studlimit) {
      setSentence("3 minutes over. But we need " + studlimit + " students to start the quiz.");
    }
    else{ /// go to next page
      const route = 'classes/' + course + '/quizstarted/'; // if 'quizstarted' == 'yes': cannot join the class. quiz is started with currently joined students
      set(ref(db, route), 'yes');
      window.location.href = "/quizinfo/"+course+'/1';
    }
  }

  //* getJoinedStudents
  /// get data of the number of joined students from DB and set the state 'joinedStudents' 
  function getJoinedStudents() {
    const route = '/classes/' + course;
    get(child(dbRef, route)).then((s) => {
      if(s.exists()){
        if(s.child('/quizstarted/').val() === 'yes'){ /// go to next page
          console.log("someone already started the quiz: ", s.child('/quizstarted/').val());
          window.location.href = "/quizinfo/"+course+'/1';
        }
        setJoinedStudents(Object.keys(s.child('/user/').val()).length);
        console.log("currently joined students: ", joinedStudents);
      }
      else{
        //TODO
      };
    });
  }

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

export default WaitingJoin;