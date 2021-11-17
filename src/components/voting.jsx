import { auth, db } from "./firebase.jsx";
import { getDatabase, ref, get, child, set } from "firebase/database";


//* handleVoting
/// input: vote - true if the user clicks 'Yes', false if the user clicks 'Try Again'
function handleVoting(vote, course, round){
  if(vote){
    /// goto Active Team page
    window.location.href = "/mypage";
  }
  else{
    /// store the current team in the DB goto quizinfo page of next round
    const nextRound = parseInt(round) + 1;
    // const route2 = '/classes/' + c + '/rooms/';
    // teams.forEach((team, index) => {//TODO
    //   set(ref(db, route2 + index + '/users'), team);
    // });
    // const dbRef = ref(getDatabase());
    // const route = '/classes/' + course + '/user/' + auth.currentUser.uid + '/';
    // get(child(dbRef, route)).then((snapshot) => {
    //   if(snapshot.exists()) {
    //       alert("Success!!!!");
    //       set(ref(db, route + 'essen_questions/' + qnum + '/importance/'), "yes");
    //   }
    //   else{
    //     alert("something is wrong"); // TODO go out to the main page
    //   }
    // });
    window.location.href = "/quizinfo/" + course + "/" + nextRound;
  }
}

//* Voting 
function Voting(props) {
  const course = props.course; 
  const round = props.round;
  const totalrounds = 3; // TODO: connect to quizinfo page
  const leftchances = totalrounds - round + 1;

  if(leftchances == 0) {
    return(
      <div className="popup">
      <div>
        There is no left chances for quiz!
      </div>
      <div>
        Now you can check your new team at 'Active Team' bar of mypage. Have a good luck on your team project!
      </div>
      <button onClick={() => handleVoting(true, course, round)}>Go to Active Team</button>
    </div>
    )
  }

  return(
    <div className="popup">
      <div>
        Discussion Time has Passed!
      </div>
      <div>
        Do you want to make team with current members?
      </div>
      <button onClick={() => handleVoting(true, course, round)}>Yes</button>
      <button onClick={() => handleVoting(false, course, round)}>Try Again ({leftchances}/{totalrounds})</button>
    </div>
  )
}

export default Voting;
