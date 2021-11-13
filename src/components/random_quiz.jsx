import React, { useState } from 'react'
import './random_quiz.css'
import { essenQcandidates, essenAcandidates, funQcandidates, funAcandidates } from './question_candidates'
import { auth, db } from "./firebase.jsx";
import { getDatabase, ref, push, get, child, set } from "firebase/database";
import LOGO from "../images/LOGO.PNG"
import team_building_algorithm from './team_building_algorithm';
import Voting from './voting.jsx';

//* handleAnswerClick: event handler when the answer button is clicked
/// input: qnum - question id, score - score of the clicked answer, answer - answer string of the clicked button, fun - true if the round>=2
/// stores the clicked answer data into DB
function handleAnswerClick(course, qnum, score, fun){
  alert("good");
  const dbRef = ref(getDatabase());
  const route = '/classes/' + course + '/user/' + auth.currentUser.uid + '/';
  get(child(dbRef, route)).then((snapshot) => {
    if(snapshot.exists()) {
      if(fun){
        set(ref(db, route + 'fun_questions/' + qnum + '/score/'), score);
      }
      else{
        set(ref(db, route + 'essen_questions/' + qnum + '/score/'), score);
      }
    }
    else{
      alert("something is wrong"); // TODO go out to the main page
    }
  });
};

//* handleImportanceClick: event handler when the importance-check button is clicked
function handleImportanceClick(course, qnum){
  const dbRef = ref(getDatabase());
  const route = '/classes/' + course + '/user/' + auth.currentUser.uid + '/';
  get(child(dbRef, route)).then((snapshot) => {
    if(snapshot.exists()) {
        alert("Success!!!!");
        set(ref(db, route + 'essen_questions/' + qnum + '/importance/'), "yes");
    }
    else{
      alert("something is wrong"); // TODO go out to the main page
    }
  });
};

//* GetAnswers
/// input: id - index of fun question in funQcandidates array
/// output: <html> - button list of each corresponding answer
function GetAnswers({course, id, fun}){
  const shuffle = (arr) => {
    return arr.slice().sort(() => Math.random() - 0.5);
  }

  if(fun){
    const answerButtons = shuffle(funAcandidates[id].answers).map(x => // shuffle: randomize the order of buttons
      <button key={x.score} className="answer" onClick = {() => handleAnswerClick(course, id, x.score, fun)}>
        {x.answer}
      </button>
    );

    return(
      <div className="answer">
        {answerButtons}
      </div>
    );
  }
  else{
    let flip = false;
    const answerTexts = shuffle(essenAcandidates[id].answers).map(x => {// shuffle: randomize the order of buttons
      if(x.score == 2) flip = true; // set flip
      return(
        <div>
          {x.answer}
        </div>
      );
    });
    const scorearr = flip ? [2, 1, 0, -1, -2] : [-2, -1, 0, 1, 2];
    const answerButtons = scorearr.map(score => // shuffle: randomize the order of buttons
      <button key={score} className="answer" onClick = {() => handleAnswerClick(course, id, score, fun)}></button>
    );

    return(
      <div className="answer">
        {answerTexts[0]}
        {answerButtons}
        {answerTexts[1]}
      </div>
    );
  }
};


//* GetRandomFunQuestions
/// input: course - course id , number - number of random questions you want to request 
/// output: <html> - set of questions and answer buttons
function GetRandomFunQuestions({course, number}){ 
  const N = funQcandidates.length;
  var randArr = [];
  for(var i =0; i<N; i++) {
    randArr.push([Math.random(), i]);
  }
  randArr.sort();
  randArr = randArr.slice(0, Math.min(number, N)); // randomly select the fun questions

  const QAobjects = randArr.map(x => // list of the html object of each question and answer set
    <li className = "question" key = {x[1]}>
      {funQcandidates[x[1]].question}
      <GetAnswers course = {course} id = {x[1]} fun={true}/>
    </li>
  );

  return (
    <ul id="quiz-content">
      {QAobjects}
    </ul>
  )
};


//* GetEssentialQuestions
/// input: none
/// output: <html> - set of questions and answer buttons
function GetEssentialQuestions({course}){ 
  const N = essenQcandidates.length;
  var randArr = [];
  for(var i =0; i<N; i++) {
    randArr.push([Math.random(), i]);
  }
  randArr.sort(); // randomly mix the essential questions

  const QAobjects = randArr.map(x => // list of the html object of each question and answer set (+ importance-check button. only exists in the first round for essential questions)
    <li className = "question" key = {x[1]}>
      <button onClick={() => handleImportanceClick(course, x[1])} className='importance_check'></button>
      {essenQcandidates[x[1]].question}
      <GetAnswers course = {course} id = {x[1]} fun = {false}/>
    </li>
  );

  return (
    <ul id="quiz-content">
      {QAobjects}
    </ul>
  )
};

//* handleDoneClick: event handler when the user clicks 'done' button after answering all questions
/// if done: build teams
function handleDoneClick(course, round, funNumber){
  //TODO check if the user answered to every questions
  const isDone = checkDone(course, round > 1 ? true : false, funNumber);
  console.log(isDone);
  if(isDone){
    team_building_algorithm(course, 2); // TODO: should define k (the number of teams)
    window.location.href = "/quizwaiting/" + course + "/" + round;
  }
  else{
    alert("not done"); //TODO
  }
};

//* checkDone - check if the user answered to every questions
/// input: course - course id, fun: true if the round is 2~ (==problems are fun questions), funNumber - number of fun questions at each round
/// if yes : set 'done'-> 'yes' and return true
/// if no  : return false
async function checkDone(course, fun, funNumber){ //TODO,, just copy&pasted
  const dbRef = ref(getDatabase());
  const route = '/classes/' + course + '/user/' + auth.currentUser.uid + '/';
  console.log(course, fun, route); 
  if(fun){
    get(child(dbRef, route + 'fun_questions/')).then((snapshot) => {
      set(ref(db, route + 'essen_questions/done/'), "no");
      const answeredquestions = Object.keys(snapshot.val());
      if(snapshot.exists() && answeredquestions.length - 1 == funNumber) { // TODO: funNumber * number of rounds
        set(ref(db, route + 'fun_questions/done/'), "yes"); //TODO: diff by rounds?
        // const teams = team_building_algorithm(course, 2); // TODO: should define k (the number of teams)
        return true;
      }
      else{
        return false;
      }
    });
  }
  else{
    get(child(dbRef, route + 'essen_questions/')).then((snapshot) => {
      set(ref(db, route + 'essen_questions/done/'), "no");
      alert("yes"); // TODO: erase later
      const answeredquestions = Object.keys(snapshot.val());
      if(snapshot.exists() && answeredquestions.length - 1 == essenQcandidates.length) {
        set(ref(db, route + 'essen_questions/done/'), "yes");
        // const teams = team_building_algorithm(course, 2); // TODO: should define k (the number of teams)
        return true;
      }
      else{
        return false;
      }
    });
  }
}

//* Titlebar
function Titlebar({title}){
  return(
    <div className = "nav_bar">
      <ul>
          <li>{title}</li>
          <ul style={{float: "left"}}>
              <a href="/"><img src={LOGO} alt = "" className='logo'/></a>
              <li><a href="/" className = "title">TUG</a></li>
          </ul>
      </ul>
    </div>
  )
}

//* Quiz - '/quiz/:course/:round' page
function Quiz(props) {
  const course = props.match.params.course; //TODO if the user is not joined in this course, go to the main page or start_quiz page
  const round = props.match.params.round;
  let fun = false; // value 'false' only for the first round 
  if(round > 1) fun = true;  // set true at 2~ rounds
  const funNumber = Math.min(funQcandidates.length, 2); // number of fun questions at each round

  const QAlist = () => {
    if(fun){ 
      return(<GetRandomFunQuestions course={course} number={funNumber} />);
    }
    else{
      return(<GetEssentialQuestions course={course} />);
    }
  }

  return(
    <div>
      <Titlebar title="Quiz Time" />
      <QAlist />
      <button onClick={() => handleDoneClick(course, round, funNumber)}>Done</button>
      <Voting /> {/*//TODO erase later*/}
    </div>
  )
};

export default Quiz;
export { Titlebar };