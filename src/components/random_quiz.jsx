import React, { useState } from 'react'
import './random_quiz.css'
import { essenQcandidates, essenAcandidates, funQcandidates, funAcandidates } from './question_candidates'
import { auth, db } from "./firebase.jsx";
import { getDatabase, ref, push, get, child, set } from "firebase/database";

//* handleDoneClick: event handler when the user clicks 'done' button after answering all questions
function handleDoneClick(){
  //TODO check if the user answered to every questions

  window.location.href = "/chat";
};

//* handleAnswerClick: event handler when the answer button is clicked
/// input: qnum - question id, score - score of the clicked answer, answer - answer string of the clicked button
/// stores the clicked answer data into DB
function handleAnswerClick(course, qnum, score, answer, fun){
  alert("good");
  const dbRef = ref(getDatabase());
  const route = '/classes/' + course + '/user/' + auth.currentUser.uid + '/';
  get(child(dbRef, route)).then((snapshot) => {
    if(snapshot.exists()) {
      if(fun){
        set(ref(db, route + 'fun_questions/' + qnum + '/score/'), score);
        set(ref(db, route + 'fun_questions/' + qnum + '/answer/'), answer);
      }
      else{
        set(ref(db, route + 'essen_questions/' + qnum + '/score/'), score);
        set(ref(db, route + 'essen_questions/' + qnum + '/answer/'), answer);
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
  const answercandidates = () => {
    if(fun) return(funAcandidates[id])
    else return(essenAcandidates[id])
  }

  const answerButtons = answercandidates().answers.map(x =>
    <button key={x.score} className="answer" onClick = {() => handleAnswerClick(course, id, x.score, x.answer, fun)}>
      {x.answer}
    </button>
  );

  return(
    <div className="answer">
      {answerButtons}
    </div>
  );
};

//* GetFunAnswers
/// input: id - index of fun question in funQcandidates array
/// output: <html> - button list of each corresponding answer
function GetFunAnswers({course, id}){
  const answerButtons = funAcandidates[id].answers.map(x =>
    <button key={x.score} className="answer" onClick = {() => handleAnswerClick(course, id, x.score, x.answer, true)}>
      {x.answer}
    </button>
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

//* GetEssenAnswers
/// input: id - index of essential question in essenQcandidates array
/// output: <html> - button list of each corresponding answer
function GetEssenAnswers({course, id}){
  const answerButtons = essenAcandidates[id].answers.map(x =>
    <button key={x.score} className="answer" onClick = {() => handleAnswerClick(course, id, x.score, x.answer, false)}>
    {x.answer}
  </button>
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
      <GetEssenAnswers course = {course} id = {x[1]} />
    </li>
  );

  return (
    <ul id="quiz-content">
      {QAobjects}
    </ul>
  )
};


function Quiz(props) {
  const course = props.match.params.course; //TODO if the user is not joined in this course, go to the main page or start_quiz page

  const QAlist = () => {
    if(true){  //TODO set true at first round, false otherwise
      return(<GetRandomFunQuestions course={course} number="2" />);
    }
    else{
      return(<GetEssentialQuestions course={course} number="2" />);
    }
  }

  return(
    <div>
      <QAlist />
      <button onClick = {handleDoneClick}>Done</button>
    </div>
  )
};

export default Quiz