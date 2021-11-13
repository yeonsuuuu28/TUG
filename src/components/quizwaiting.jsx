import { Titlebar } from "./random_quiz.jsx";
import React, { useState } from 'react'
import { getDatabase, ref, push, get, child, set } from "firebase/database";
import team_building_algorithm from './team_building_algorithm';

//* QuizWaiting - '/quizwaiting/:course/:round' page
function QuizWaiting(props) {
  const course = props.match.params.course;
  const round = props.match.params.round;
  const dbRef = ref(getDatabase());
  const route = '/classes/' + course + '/user/';
  // const [totalStudents, setTotalStudents] = useState('');
  const [leftStudents, setLeftStudents] = useState('');

  setTimeout(setInterval(getLeftStudents(), 10000), 5000);
  
  if(leftStudents == 0){
    team_building_algorithm(course, 2); // TODO: should define k (the number of teams)
    window.location.href = "/chat"; /// goto chat page
  }

  //* getLeftStudents
  /// output: leftStudents - number of left students that did not finished the quiz
  function getLeftStudents() {
    get(child(dbRef, route)).then((s) => {
      const totalStudents = Object.keys(s.val()).length;
      // setTotalStudents(totalStudents); // set total students
      let leftStudents = totalStudents;
      s.forEach((user) => {
        if(user.child('/essen_questions/done/').val() === 'yes') { // essential questions
          if( round > 1 ? true : false ){
            if(user.child('/fun_questions/done/').val() === 'yes'){ // fun questions 
              leftStudents = leftStudents - 1;
            }
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