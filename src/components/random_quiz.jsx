import React from 'react'
import './random_quiz.css'

const essenQcandidates = [ // candidates of essential questions for team building
  "Which is more comfortable to you, Korean or English?",
  "Do you prefer Korean-using teammates or English-using teammates?",
  "Are you good at Python?",
  "Do you prefer python available teammate?",
  "Are you enthusiastic or relaxed in the team?",
  "Do you prefer enthusiastic or relaxed teammates?",
  "What time do you usually work?",
  "Which communication style do you prefer?",
  "Do you start the project early or late?",
  "What is your gender?",
  "Which gender do you prefer as your teammates?",
  "What grade are you in?",
  "Which grade do you prefer as your teammates?",
]
const essenAcandidates = [ // range description for each essenQcandidates
  ["Korean", "English"],
  ["Korean", "English"],
  ["Yes", "No"],
  ["Yes", "No"],
  ["Enthusiastic", "Relaxed"],
  ["Enthusiastic", "Relaxed"],
  ["Morning", "Daybreak"],
  ["Real-time", "Non-real-time"],
  ["Early", "Late"],
  ["Female", "Male"],
  ["Female", "Male"],
  ["Freshman", "Senior"],
  ["Freshman", "Senior"],
]

const funQcandidates = [ // candidates of fun questions
  "Do you like pineapple pizza?",
  "Do you like mint-chocolate?",
  "Choose any color below!",
]

const funAcandidates = [ // possible answers for each funQcandidates
  ["Absolutely", "Maybe", "Never"],
  ["Absolutely", "Maybe", "Never"],
  ["Yellow", "Green", "Skyblue"],
]

const quiz = () => {

    function handleclick(){
        window.location.href = "/chat";
    }

    //* GetFunAnswers
    /// input: qnum - index of fun question in funQcandidates array
    /// output: <html> - button list of each corresponding answer
    function GetFunAnswers({qnum}){
      const answerButtons = funAcandidates[qnum].map(x =>
            <button class="funA" onclick={handleclick}>{x}</button>
      );

      return(
        <ul class="funA">
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
      randArr = randArr.slice(0, Math.min(number, N));

     const QAobjects = randArr.map(x =>
        <div class = "funQ">
          {funQcandidates[x[1]]}
          <GetFunAnswers qnum = {x[1]} />
        </div>
      );

      return (
        <div id="quiz-content">
          {QAobjects}
        </div>
      )
    }

    return (
        <div>
            <GetRandomFunQuestions number="2" />
            <button onClick = {handleclick}>CHAT!</button>
        </div>
    )
}

export default quiz