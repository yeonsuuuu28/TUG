import Navbar from "./navbar_quiz.jsx";
import React, { useState } from 'react'
import { getDatabase, ref, get, child } from "firebase/database";
import team_building_algorithm from './team_building_algorithm';
import "./quizwaiting.css";
import classes from "./classes_list.jsx";

//* QuizWaiting - '/quizwaiting/:course/:round' page
function QuizWaiting(props) {
  const course = props.match.params.course;
  const round = props.match.params.round;
  const dbRef = ref(getDatabase());
  const route = '/classes/' + course + '/user/';
  let rooms = 2;
  const [leftStudents, setLeftStudents] = useState('loading...');

  setInterval(getLeftStudents, 1000);
  
  if(leftStudents[0] === '0'){
    const totalStudents = leftStudents.split(' / ')[1];
    // if(totalStudents >= 11) rooms = Math.round(totalStudents/4); // 11~: [totalStudents/4] rooms
    // else if(totalStudents >= 6) rooms = Math.round(totalStudents/3); // ~3: 1 room, 4~7: 2 rooms, 8~10: 3 rooms
    // else if(totalStudents >= 4) rooms = Math.round(totalStudents/2);  
    for(var i =0; i<classes.length; i++){ // set rooms
      if(classes[i].code === course) {
        rooms = Math.round(Math.ceil(totalStudents/classes[i].team));
        break;
      }
    }
    team_building_algorithm(course, round, rooms); // TODO: should define n (the number of teams)
    setTimeout(() => window.location.href = "/chat/" + course + "/" + round, 1000);  /// goto chat page
  }

  //* getLeftStudents
  /// output: leftStudents - number of left students that did not finished the quiz
  /// set number of rooms to divide students
  function getLeftStudents() {
    var totalStudents = 0;
    console.log("startleft, ", leftStudents);
    get(child(dbRef, route)).then((s) => {
      totalStudents = Object.keys(s.val()).length;
      let ls = totalStudents;
      s.forEach((user) => {
        if(user.child('/essen_questions/done/').val() === 'yes') { // essential questions
          if( round > 1 ? true : false ){
            if(user.child('/fun_questions/done/').val() === 'yes'){ // fun questions 
              console.log("userchild fun: ", user.key, user.child('/fun_questions/done/').val());
              ls = ls - 1;
            }
            else console.log(user);
          }
          else ls = ls - 1;
        }
      });
      console.log("left: ", ls);
      setLeftStudents(ls + ' / ' + totalStudents); // set left students
    });
  }

  return(
    <div>
      <Navbar/>
      <div className="waiting_main_title">
        Waiting for Other Students...
      </div>
      <div className="waiting_description_align">
      <div className="waiting_description">
        Please wait for your peers to finish the quiz!<br/>
        Chat Round {round} will start soon. Who will be your first team?<br/>
        We hope you could find your suitable teammates!<br/>
      </div>
      <div className="waiting_number">
        <b>{leftStudents}</b>
      </div>
      </div>
    </div>
  );
}

export default QuizWaiting;