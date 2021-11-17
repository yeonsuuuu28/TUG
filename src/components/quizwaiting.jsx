import { Titlebar } from "./random_quiz.jsx";
import React, { useState } from 'react'
import { getDatabase, ref, get, child } from "firebase/database";
import team_building_algorithm from './team_building_algorithm';
import Voting from "./voting.jsx";

//* QuizWaiting - '/quizwaiting/:course/:round' page
function QuizWaiting(props) {
  const course = props.match.params.course;
  const round = props.match.params.round;
  const dbRef = ref(getDatabase());
  const route = '/classes/' + course + '/user/';
  let rooms = 1;
  const [leftStudents, setLeftStudents] = useState('loading...');

  setTimeout(setInterval(getLeftStudents(), 10000), 5000);
  
  if(leftStudents[0] === '0'){
    const totalStudents = leftStudents.split(' / ')[1];
    if(totalStudents >= 11) rooms = Math.round(totalStudents/4); // 11~: [totalStudents/4] rooms
    else if(totalStudents >= 6) rooms = Math.round(totalStudents/3); // ~3: 1 room, 4~7: 2 rooms, 8~10: 3 rooms
    else if(totalStudents >= 4) rooms = Math.round(totalStudents/2);  
    
    // console.log("leftStudents", leftStudents.split(' / ')[1]);
    // console.log("rooms: ", round, rooms);
    team_building_algorithm(course, round, rooms ); // TODO: should define n (the number of teams)
    window.location.href = "/chat/" + course + "/" + round;  /// goto chat page
  }

  //* getLeftStudents
  /// output: leftStudents - number of left students that did not finished the quiz
  /// set number of rooms to divide students
  function getLeftStudents() {
    get(child(dbRef, route)).then((s) => {
      const totalStudents = Object.keys(s.val()).length;
      let leftStudents = totalStudents;
      s.forEach((user) => {
        if(user.child('/essen_questions/done/').val() === 'yes') { // essential questions
          if( round > 1 ? true : false ){
            if(user.child('/fun_questions/done/').val() === 'yes'){ // fun questions 
              console.log("userchild fun: ", user.key, user.child('/fun_questions/done/').val());
              leftStudents = leftStudents - 1;
            }
            else console.log(user);
          }
          else leftStudents = leftStudents - 1;
          console.log("left: ", leftStudents);
        }
      });
      setLeftStudents(leftStudents + ' / ' + totalStudents); // set left students
    });
  }

  return(
    <div>
      <Titlebar title="Quiz Time" />
      <div>
        Waiting for Other Students...
      </div>
      <div>
        Please wait for your peers to finish the quiz!
        Round {round} will start soon. Who will be your first team?
        We hope you could find your suitable teammates!
      </div>
      <div>
        {leftStudents}
      </div>
    </div>
  );
}

export default QuizWaiting;