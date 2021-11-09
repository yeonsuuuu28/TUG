import React, { useState } from 'react'
import './random_quiz.css'
import { essenQcandidates, essenAcandidates, funQcandidates, funAcandidates } from './question_candidates'
import { auth, db } from "./firebase.jsx";
import { getDatabase, ref, push, get, child, set } from "firebase/database";

let course = "";

function handleclick(){
  window.location.href = "/chat";
};

//* handleAnswerClick: event handler when the answer button is clicked
/// input: qnum - question id, score - score of the clicked answer, answer - answer string of the clicked button
/// stores the clicked answer data into DB
function handleAnswerClick(qnum, score, answer){
  const dbRef = ref(getDatabase());
  const route = '/classes/' + course + '/user/' + auth.currentUser.uid + '/';
  get(child(dbRef, route)).then((snapshot) => {
    if(snapshot.exists()) {
        set(ref(db, route + 'questions/' + qnum + '/score/'), score);
        set(ref(db, route + 'questions/' + qnum + '/answer/'), answer);
    }
    else{
      alert("something is wrong"); // TODO go out to the main page
    }
  });
};

//* handleImportanceClick: event handler when the importance-check button is clicked
function handleImportanceClick(qnum){
  const dbRef = ref(getDatabase());
  const route = '/classes/' + course + '/user/' + auth.currentUser.uid + '/';
  get(child(dbRef, route)).then((snapshot) => {
    if(snapshot.exists()) {
        alert("Success!!!!");
        set(ref(db, route + 'questions/' + qnum + '/importance/'), "yes");
    }
    else{
      alert("something is wrong"); // TODO go out to the main page
    }
  });
};

//* GetFunAnswers
/// input: id - index of fun question in funQcandidates array
/// output: <html> - button list of each corresponding answer
function GetFunAnswers({id}){
  const answerButtons = funAcandidates[id].answers.map(x =>
    <div key={x.score} className="answer" onClick = {() => handleAnswerClick(id, x.score, x.answer)}>
      {x.answer}
    </div>
  );

  return(
    <div className="answer">
      {answerButtons}
    </div>
  );
};

//* GetRandomFunQuestions
/// input: number - number of random questions you want to request 
/// output: <html> - set of questions and answer buttons
function GetRandomFunQuestions({number}){ 
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
      <GetFunAnswers id = {x[1]} />
    </li>
  );

  return (
    <ul id="quiz-content">
      {QAobjects}
    </ul>
  )
};

//* GetEssenAnswers
/// input: id - index of essential question in essenQcandidates array
/// output: <html> - button list of each corresponding answer
function GetEssenAnswers({id}){
  const answerButtons = essenAcandidates[id].answers.map(x =>
    <div key={x.score} className="answer" onClick = {() => handleAnswerClick(id, x.score, x.answer)}>
    {x.answer}
  </div>
  );

  return(
    <ul className="answer">
      {answerButtons}
    </ul>
  );
};

//* GetEssentialQuestions
/// input: none
/// output: <html> - set of questions and answer buttons
function GetEssentialQuestions(){ 
  const N = essenQcandidates.length;
  var randArr = [];
  for(var i =0; i<N; i++) {
    randArr.push([Math.random(), i]);
  }
  randArr.sort(); // randomly mix the essential questions

  const QAobjects = randArr.map(x => // list of the html object of each question and answer set (+ importance-check button. only exists in the first round for essential questions)
    <li className = "question" key = {x[1]}>
      <button onClick={handleImportanceClick(x[1])} className='importance_check'></button>
      {essenQcandidates[x[1]].question}
      <GetEssenAnswers id = {x[1]} />
    </li>
  );

  return (
    <ul id="quiz-content">
      {QAobjects}
    </ul>
  )
};

const quiz = (props) => {
  course = props.course; // set course name
  course = "CS473"; //TODO: erase later

  if(true){ //TODO set true at first round, false otherwise
    return (
      <div>
          <GetRandomFunQuestions number="2" />
          <button onClick = {handleclick}>CHAT!</button>
      </div>
  )
  }
  else{
    return (
      <div>
          <GetEssentialQuestions number="2" />
          <button onClick = {handleclick}>CHAT!</button>
      </div>
    )
  }
    
};

export default quiz