import React, { useState } from 'react'
import './random_quiz.css'
import { essenQcandidates, essenAcandidates, funQcandidates, funAcandidates } from './question_candidates'
import { auth, db } from "./firebase.jsx";
import { getDatabase, ref, get, child, set } from "firebase/database";
import LOGO from "../images/LOGO.PNG"
import Voting from './voting.jsx';
// import { isImportEqualsDeclaration } from 'typescript';

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
      if(x.score === 2) flip = true; // set flip
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
/// input: course - course id , round, number - number of random questions you want to request 
/// output: <html> - set of questions and answer buttons
function GetRandomFunQuestions({course, round, number}){ 
  const dbRef = ref(getDatabase());
  const route = '/classes/' + course + '/fun_order/';
  const N = funQcandidates.length;
  const [questions, setQuestions] = useState([]);

  get(child(dbRef, route)).then((snapshot) => {
    if(snapshot.exists()) {
      const history = Object.values(snapshot.val());
      if(questions.length === 0){
        setQuestions(history.slice(Math.min((round-2) * number, N), Math.min((round-1) * number, N)));
      }
    }
    else{
      var randArr = [];
      for(var i =0; i<N; i++) {
        randArr.push([Math.random(), i]);
      }
      randArr.sort();
      const history = randArr.map(x => x[1]);
      set(ref(db, route), history);
      if(questions.length === 0){
        setQuestions(history.slice(Math.min((round-2) * number, N), Math.min((round-1) * number, N)));
      }
    }
  });

  const QAobjects = questions.map(x => // list of the html object of each question and answer set
    <li className = "question" key = {x}>
      {funQcandidates[x].question}
      <GetAnswers course = {course} id = {x} fun={true}/>
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
/// input: course - course id, round, funNumber - number of fun questions at each round
/// if done: goto quizwaiting page
function handleDoneClick(course, round, funNumber){
  const dbRef = ref(getDatabase());
  const route = '/classes/' + course + '/user/' + auth.currentUser.uid + '/';
  console.log(course, round, route); 

  /// essential questions
  get(child(dbRef, route + 'essen_questions/')).then((snapshot) => {
    set(ref(db, route + 'essen_questions/done/'), "no");
    const answeredquestions = Object.keys(snapshot.val());
    if(snapshot.exists() && answeredquestions.length - 1 === essenQcandidates.length) {
      set(ref(db, route + 'essen_questions/done/'), "yes");
      console.log(course, round, route, round==1); 
      if(round === '1') { /// done
        window.location.href = "/quizwaiting/" + course + "/" + round;
      }
    }
    else{
      if(round === '1') alert("not done"); //TODO
    }
  });

  if(round > 1){ /// fun questions
    get(child(dbRef, route + 'fun_questions/')).then((snapshot) => {
      set(ref(db, route + 'fun_questions/done/'), "no");
      const answeredquestions = Object.keys(snapshot.val());
      if(snapshot.exists() && answeredquestions.length - 1 === Math.min(funNumber*(round - 1), funQcandidates.length)) {
        set(ref(db, route + 'fun_questions/done/'), "yes");
        // console.log("What: ",answeredquestions.length - 1 === Math.min(funNumber*(round - 1), funQcandidates.length));

        /// done
        window.location.href = "/quizwaiting/" + course + "/" + round;
      }
      else{
        // console.log("Whatf: ",answeredquestions.length - 1 === Math.min(funNumber*(round - 1), funQcandidates.length));

        alert("not done"); //TODO
      }
    });
  }
};



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
  const course = props.match.params.course; //TODO if the user is not joined in this course or already finished building team, go to the main page or start_quiz page
  const round = props.match.params.round;
  let fun = false; // value 'false' only for the first round 
  if(round > 1) fun = true;  // set true at 2~ rounds
  const funNumber = Math.min(funQcandidates.length, 2); // number of fun questions at each round

  const QAlist = () => {
    if(fun){ 
      return(<GetRandomFunQuestions course={course} number={funNumber} round={round}/>);
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
    </div>
  )
};

export default Quiz;
export { Titlebar };