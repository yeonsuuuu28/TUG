
//* handleVoting
/// input: vote - true if the user clicks 'Yes', false if the user clicks 'Try Again'
function handleVoting(vote, course, round){
  if(vote){
    /// goto Active Team page
    window.location.href = "/activeteams";
  }
  else{
    /// goto quizinfo page of next round
    window.location.href = "/quizinfo/" + course + "/" + round;
  }
}

//* Voting 
function Voting(props) {
  // const course = props.course; //TODO
  // const round = props.round;
  const course = 'CS473';
  const round = 1;
  const totalrounds = 3; // TODO: connect to quizinfo page
  const leftchances = totalrounds - round + 1;

  return(
    <div class="popup">
      <div>
        Discussion Time has Passed!
      </div>
      <div>
        Do you want to make team with current members?
      </div>
      <button onClick={() => handleVoting(true, course, round)}>Yes</button>
      <button onClick={() => handleVoting(false, course, round+1)}>Try Again ({leftchances}/{totalrounds})</button>
    </div>
  )
}

export default Voting;
