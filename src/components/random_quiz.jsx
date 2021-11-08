import React from 'react'
import './random_quiz.css'
import { essenQcandidates, essenAcandidates, funQcandidates, funAcandidates } from './question_candidates'
import { auth, db } from "./firebase.jsx";
import { getDatabase, ref, push, get, child } from "firebase/database";

function handleclick(){
  window.location.href = "/chat";
}

//* handleAnswerClick: event handler when the answer button is clicked
function handleAnswerClick(){
  //TODO store the answer into DB
  const dbRef = ref(getDatabase());
  // get(child(dbRef, 'users/' + auth.currentUser.displayName + ('users/' + 'userId').set({
  //   username: 'name', //TODO: get the username
  //   answer: 'answer'
  // });
  console.log('You clicked!');
}

//* handleImportantClick: event handler when the importance-check button is clicked
function handleImportantClick(){
  //TODO
}

//* GetFunAnswers
/// input: id - index of fun question in funQcandidates array
/// output: <html> - button list of each corresponding answer
function GetFunAnswers({id}){
  const answerButtons = funAcandidates[id].answers.map(x =>
    <li key={x.score}>
      <button className="answer" onClick = {handleAnswerClick}>{x.answer}</button>
    </li>
  );

  return(
    <ul className="answer">
      {answerButtons}
    </ul>
  );
}

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
}

//* GetEssenAnswers
/// input: id - index of essential question in essenQcandidates array
/// output: <html> - button list of each corresponding answer
function GetEssenAnswers({id}){
  const answerButtons = essenAcandidates[id].answers.map(x =>
    <li key={x.score}>
      <button className="answer" onClick = {handleAnswerClick}>{x.answer}</button>
    </li>
  );

  return(
    <ul className="answer">
      {answerButtons}
    </ul>
  );
}

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
      <button onClick={handleImportantClick} className='importance_check'></button>
      {essenQcandidates[x[1]].question}
      <GetEssenAnswers id = {x[1]} />
    </li>
  );

  return (
    <ul id="quiz-content">
      {QAobjects}
    </ul>
  )
}

const quiz = () => {
  if(false){ //TODO set true at first round, false otherwise
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
    
}

export default quiz