import { essenQcandidates } from './question_candidates.jsx';
import { getDatabase, ref, get, child } from "firebase/database";
import { Titlebar } from './random_quiz.jsx';

function handleGetStarted(course, round){
  window.location.href = "/quiz/" + course + '/' + round;
}


//* QuizInformation
/// right before page that links to the quiz session
function QuizInformation(props){
  console.log("helloquizinfo");

  const course = props.match.params.course; //TODO if the user is not joined in this course, go to the main page or start_quiz page
  const round = props.match.params.round;
  const totalrounds = 3;
  const leftrounds = totalrounds - round + 1;
  const questions = essenQcandidates.length; //TODO funQcandidates for 2~ rounds
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

  const [minN, maxN] = [1, 2] // TODO

  const title = () => {
    if(round === 1) return "It's Quiz Time!";
    else return "Quiz Round " + round;
  }

  return(
    <div>
      <Titlebar title="Quiz Time" />
      <div>
      {title()}
      </div>
      <div>
        You will solve another {questions} questions on this quiz!
        Your answer would again group you into teams of {minN} ~ {maxN}.
        Freely communicate and decide if you like the team.
        Bear in mind you only have {leftrounds} limited rounds left!
      </div>
      <button onClick={()=>handleGetStarted(course, round)}>GET STARTED</button>
    </div>
  )
}

export default QuizInformation;