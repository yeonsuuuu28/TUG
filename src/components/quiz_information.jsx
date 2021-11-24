import { essenQcandidates } from './question_candidates.jsx';
import { getDatabase, ref, get, child } from "firebase/database";
import Navbar from "./navbar_quiz.jsx";
import "./quiz_information.css";
import React, { useState } from 'react'


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
  /// 11~: [totalStudents/4] rooms
  /// ~3: 1 room, 4~7: 2 rooms, 8~10: 3 rooms
  function getStudentsMinMax() {
    get(child(dbRef, route)).then((s) => {
      const totalStudents = Object.keys(s.val()).length;
      const divide = () => {
        if(totalStudents <= 3) return 1;
        else if(totalStudents <= 7) return 2;
        else if(totalStudents <= 10) return 3;
        else return 4;
      }
      const divided = totalStudents/divide();

      if((divided - Math.floor(divided)) > 0){
        setStdMinMax(Math.floor(divided) + ' ~ ' + Math.ceil(divided));
      }
      else{
        setStdMinMax(parseInt(divided));
      }

      // if(totalStudents <= 3){
      //   setStdMinMax(totalStudents);
      // }
      // else if(totalStudents <= 7){
      //   if(totalStudents === 4 || totalStudents === 6){
      //     setStdMinMax(parseInt(totalStudents/2));
      //   }
      //   else{
      //     setStdMinMax(Math.floor(totalStudents/2)+' ~ '+Math.ceil(totalStudents/2));
      //   }
      // }
      // else if(totalStudents <= 10){
      //   if(totalStudents === 9){
      //     setStdMinMax(parseInt(totalStudents/3));
      //   }
      //   else{
      //     setStdMinMax(Math.floor(totalStudents/3)+' ~ '+Math.ceil(totalStudents/3));
      //   }
      // }
      // else{
      //   if(((totalStudents / 4) - Math.floor(totalStudents / 4)) > 0){
      //     setStdMinMax(Math.floor(totalStudents/4) + ' ~ ' + Math.ceil(totalStudents/4));
      //   }
      // }
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