import React, { useState } from 'react'
import './random_quiz.css'
import { essenQcandidates, essenAcandidates, funQcandidates, funAcandidates } from './question_candidates'
import { auth, db } from "./firebase.jsx";
import { getDatabase, ref, get, child, set } from "firebase/database";
import { Checkbox } from "@mui/material";
import { FormControl } from "@mui/material";
import { RadioGroup, Radio } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import Navbar from "./navbar_quiz.jsx";

//* handleAnswerClick: event handler when the answer button is clicked
/// input: qnum - question id, score - score of the clicked answer, answer - answer string of the clicked button, fun - true if the round>=2
/// stores the clicked answer data into DB
function handleAnswerClick(course, qnum, score, fun){
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

  const [selectedValue, setSelectedValue] = React.useState();
  const handleChange = (event, course, id, score ,fun) => {
    setSelectedValue(event.target.value);
    handleAnswerClick(course, id, score, fun)
  };


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

      <Radio
        checked = {selectedValue === (score + "")}
        onChange = {(e) => handleChange(e, course, id, score, fun)}
        value = {score + ""}
        name = "radio-buttons"
      />
      // <button key={score} className="answer" onClick = {() => handleAnswerClick(course, id, score, fun)}></button>
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

  console.log(questions)
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
function GetEssentialQuestions({course, randArr}){ 
  const [Q1, setQ1] = React.useState("");
  const [Q2, setQ2] = React.useState("");
  const [Q3, setQ3] = React.useState("");
  const [Q4, setQ4] = React.useState("");
  const [Q5, setQ5] = React.useState("");
  const [Q6, setQ6] = React.useState("");
  const [Q7, setQ7] = React.useState("");
  const [Q8, setQ8] = React.useState("");
  const [Q9, setQ9] = React.useState("");
  const [Q10, setQ10] = React.useState("");
  const [Q11, setQ11] = React.useState("");
  const [Q12, setQ12] = React.useState("");
  const [Q13, setQ13] = React.useState("");
  const [checked1, setCheck1] = React.useState(false);
  const [checked2, setCheck2] = React.useState(false);
  const [checked3, setCheck3] = React.useState(false);
  const [checked4, setCheck4] = React.useState(false);
  const [checked5, setCheck5] = React.useState(false);
  const [checked6, setCheck6] = React.useState(false);
  const [checked7, setCheck7] = React.useState(false);
  const [checked8, setCheck8] = React.useState(false);
  const [checked9, setCheck9] = React.useState(false);
  const [checked10, setCheck10] = React.useState(false);
  const [checked11, setCheck11] = React.useState(false);
  const [checked12, setCheck12] = React.useState(false);
  const [checked13, setCheck13] = React.useState(false);
  var dict = {
    "Q1": Q1,
    "Q2": Q2,
    "Q3": Q3,
    "Q4": Q4,
    "Q5": Q5,
    "Q6": Q6,
    "Q7": Q7,
    "Q8": Q8,
    "Q9": Q9,
    "Q10": Q10,
    "Q11": Q11,
    "Q12": Q12,
    "Q13": Q13,
    "checked1": checked1,
    "checked2": checked2,
    "checked3": checked3,
    "checked4": checked4,
    "checked5": checked5,
    "checked6": checked6,
    "checked7": checked7,
    "checked8": checked8,
    "checked9": checked9,
    "checked10": checked10,
    "checked11": checked11,
    "checked12": checked12,
    "checked13": checked13,
  }

  function submitEssen(){
    const route = '/classes/' + course + '/user/' + auth.currentUser.uid + '/'
    var temp = {}
    if(Q1 && Q2 && Q3 && Q4 && Q5 && Q6 && Q7 && Q8 && Q9 && Q10 && Q11 && Q12 && Q13){
      for (var i = 0; i < 13; i++){
        temp[randArr[i][1]] = {score: dict["Q"+(i+1)]}
      }
      temp["done"] = "yes"
      set(ref(db, route + 'essen_questions/'), temp)
      window.location.href = "/quizwaiting/" + course + "/1";
    }
    else{
      alert("Please answer all questions to submit")
    }
  }
  
  function setQ(qNo, e){
    if(qNo === 1){
      setQ1(e)
    }
    if(qNo === 2){
      setQ2(e)
    }
    if(qNo === 3){
      setQ3(e)
    }
    if(qNo === 4){
      setQ4(e)
    }
    if(qNo === 5){
      setQ5(e)
    }
    if(qNo === 6){
      setQ6(e)
    }
    if(qNo === 7){
      setQ7(e)
    }
    if(qNo === 8){
      setQ8(e)
    }
    if(qNo === 9){
      setQ9(e)
    }
    if(qNo === 10){
      setQ10(e)
    }
    if(qNo === 11){
      setQ11(e)
    }
    if(qNo === 12){
      setQ12(e)
    }
    if(qNo === 13){
      setQ13(e)
    }
  }

  function handleChange(e){
    if(e === 1){
      if(checked1){
        setCheck1(false)
      }
      else{
        setCheck1(true)
      }
    }
    if(e === 2){
      if(checked2){
        setCheck2(false)
      }
      else{
        setCheck2(true)
      }
    }
    if(e === 3){
      if(checked3){
        setCheck3(false)
      }
      else{
        setCheck3(true)
      }
    }
    if(e === 4){
      if(checked4){
        setCheck4(false)
      }
      else{
        setCheck4(true)
      }
    }
    if(e === 5){
      if(checked5){
        setCheck5(false)
      }
      else{
        setCheck5(true)
      }
    }
    if(e === 6){
      if(checked6){
        setCheck6(false)
      }
      else{
        setCheck6(true)
      }
    }
    if(e ===  7){
      if(checked7){
        setCheck7(false)
      }
      else{
        setCheck7(true)
      }
    }
    if(e === 8){
      if(checked8){
        setCheck8(false)
      }
      else{
        setCheck8(true)
      }
    }
    if(e === 9){
      if(checked9){
        setCheck9(false)
      }
      else{
        setCheck9(true)
      }
    }
    if(e === 10){
      if(checked10){
        setCheck10(false)
      }
      else{
        setCheck10(true)
      }
    }
    if(e === 11){
      if(checked11){
        setCheck11(false)
      }
      else{
        setCheck11(true)
      }
    }
    if(e === 12){
      if(checked12){
        setCheck12(false)
      }
      else{
        setCheck12(true)
      }
    }
    if(e === 13){
      if(checked13){
        setCheck13(false)
      }
      else{
        setCheck13(true)
      }
    }
  }
  var result = [];

  for(var j = 0; j < randArr.length; j ++){
    const qNo = j+1
    result.push(
      <>
        <table className = "quizTable">
        <tbody>
          <tr>
              <td className = "nopadding">

              </td>
              <td className = "mini_explanation">
                  Check if this question<br/> is important to you!
              </td>
          </tr>
          <tr>
            <td className = "question_title12">
                <b>Q{j+1}</b>. {essenQcandidates[randArr[j][1]].question}
            </td>
            <td className = "checkboxQuiz">
                <Checkbox
                    checked={dict["checked"+ qNo]}
                    onChange={() => handleChange(qNo)}
                    inputProps={{ 'aria-label': 'controlled' }}
                      sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                /> 
            </td>
        </tr>
        </tbody>
      </table>
      <div className = "centerAlign">
        <FormControl component="fieldset">
          <RadioGroup row aria-label="position" name="position" value={dict["Q"+qNo]} onChange={(e) => setQ(qNo, e.target.value)} sx={{
            '& .MuiSvgIcon-root': {
              fontSize: 35,
            },
          }}> 
            <FormControlLabel
            value="-2"
            control={<Radio color="primary" />}
            label= {essenAcandidates[randArr[j][1]].answers[0].answer}
            labelPlacement="start"
            className = "radioform"
            sx={{
                '.MuiFormControlLabel-label': {
                  fontSize: 20,
                  marginRight: 10,
                },
              }}
            />
            <FormControlLabel
            value="-1"
            control={<Radio color="primary" />}
            label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
            labelPlacement="start"
            className = "radioform"
            sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: 35,
                },
              }}
            />
            <FormControlLabel
            value="0"
            control={<Radio color="primary" />}
            label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
            labelPlacement="start"
            sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: 35,
                },
              }}
            className = "radioform"
            />
            <FormControlLabel
            value="1"
            control={<Radio color="primary" />}
            label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
            labelPlacement="start"
            sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: 35,
                },
              }}
            className = "radioform"
            />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <FormControlLabel
            value="2"
            control={<Radio color="primary" />}
            sx={{
                '.MuiFormControlLabel-label': {
                  fontSize: 20,
                  marginLeft: 10,
                },
              }}
            label={essenAcandidates[randArr[j][1]].answers[1].answer}
            labelPlacement="end"
            className = "radioform"
            />
        </RadioGroup>
      </FormControl>
      </div>
      <br/>
      <br/>
    </>
    )
  }
  result.push(
    <>
      <br/> 
      <div className = "buttonDone" onClick = {submitEssen}>
        DONE
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
    </>
  )
  return result
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
      console.log(course, round, route, round===1); 
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



//* Quiz - '/quiz/:course/:round' page
function Quiz(props) {
  const course = props.match.params.course; //TODO if the user is not joined in this course or already finished building team, go to the main page or start_quiz page
  const round = props.match.params.round;
  const N = essenQcandidates.length;
  var randArrEssen = [];
  for(var i =0; i<N; i++) {
    randArrEssen.push([Math.random(), i]);
  }
  randArrEssen.sort(); // randomly mix the essential questions
  let fun = false; // value 'false' only for the first round 
  if(round > 1) fun = true;  // set true at 2~ rounds
  const funNumber = Math.min(funQcandidates.length, 2); // number of fun questions at each round

  const QAlist = () => {
    if(fun){ 
      return(<GetRandomFunQuestions course={course} number={funNumber} round={round} />);
    }
    else{
      return(<GetEssentialQuestions course={course} randArr={randArrEssen}/>);
    }
  }

  return(
    <div>
      <Navbar />
      <div className = "join_title">
        It's Quiz Time!
      </div>
      <br/>
      <br/>
      <QAlist />
      {/*<button onClick={() => handleDoneClick(course, round, funNumber)}>Done</button>*/}
    </div>
  )
};

export default Quiz;