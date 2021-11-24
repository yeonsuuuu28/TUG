import { essenQcandidates } from './question_candidates.jsx';
import { getDatabase, ref, get, child } from "firebase/database";
import Navbar from "./navbar_quiz.jsx";
import "./quiz_information.css";
import React, { useState } from 'react'
import classes from "./classes_list.jsx";


function handleGetStarted(course, round){
  window.location.href = "/quiz/" + course + '/' + round;
}


//* QuizInformation
/// right before page that links to the quiz session
function QuizInformation(props){
  const course = props.match.params.course; //TODO if the user is not joined in this course, go to the main page or start_quiz page
  const round = props.match.params.round;
  const totalrounds = 3;
  const leftrounds = totalrounds - round + 1;
  const questions = (parseInt(round) === 1) ? essenQcandidates.length : 2; //TODO funQcandidates for 2~ rounds
  // const k = 2; //TODO: number of teams
  // let users; // Number of students joined in the class
  const dbRef = ref(getDatabase());
  const route = '/classes/' + course + '/user/';
  get(child(dbRef, route)).then((snapshot) => {
    if(snapshot.exists()){
      const courseid = Object.values(snapshot.val());
      console.log(courseid);
    }
  });

  const [stdMinMax, setStdMinMax] = useState('2 ~ 3');
  getStudentsMinMax();

  //* getStudentsMinMax
  function getStudentsMinMax() {
    get(child(dbRef, route)).then((s) => {
      const totalStudents = Object.keys(s.val()).length;
      const divide = () => {
        for(var i =0; i<classes.length; i++){
          if(classes[i].code === course) {
            console.log("sdlksdf", classes[i].team);
            return classes[i].team;
          }
        }
      }
      const divided = totalStudents/divide();

      if((divided - Math.floor(divided)) > 0){ // totalStudents is multiple of divide()
        setStdMinMax(Math.floor(divide()-0.5) + ' ~ ' + Math.ceil(divide()-0.5));
      }
      else{
        setStdMinMax(parseInt(divide()));
      }
    });
  }


  return(
    <div>
      <Navbar />
      <div className="quiz_main_title">
        It's Quiz Time!
      </div>
      <div className="quiz_round_title">
        Round {round}
      </div>
      <div className="quiz_description_align">
      <div className="quiz_description">
        You will solve <b>{questions} quiz questions</b>. Please be honest! <br/>
        Your answer would group you into <b>teams of {stdMinMax}</b>.<br/><br/>
        Freely communicate and decide if you like the team.<br/>
        Bear in mind you only have <b>{leftrounds} limited rounds left</b>!
      </div>
      </div>
      <div className="button3" onClick={()=>handleGetStarted(course, round)}>GET STARTED</div>
    </div>
  )
}

export default QuizInformation;