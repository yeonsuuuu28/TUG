import { db } from "./firebase.jsx";
import { getDatabase, ref, get, child, set } from "firebase/database";
import kmeans from './kmeans.jsx';
import classes from "./classes_list.jsx";

//* calculateRandomParameter
/// input: course - course id, s - snapshot of DB of .../fun_questions
/// output: value of random parameter
function calculateRandomParameter(fun_scores){
  const randomness = 0.1;
  return randomness * fun_scores.reduce((a, b) => a+b, 0);
}

//* PCA
/// input: dataset - dataset is a two-dimensional array where rows represent the samples and columns the features
/// output: dataset after PCA dimension reduction
// function PCA(dataset) {
//   const { PCA } = require('ml-pca');
//   const a = [[0,0,0,0,0], [1,1,1,1,1], [20,20,20,20,20], [23,23,23,23,23]];
//   const b = a[0].map((_, colIndex) => a.map(row => row[colIndex])); // transpose

//   const pca = new PCA(a);
  // const pca = new PCA(dataset);
  // console.log("hello", pca.getExplainedVariance());
  // console.log(pca);
  // const newPoints = [
  //   [4.9, 3.2, 1.2, 0.4],
  //   [5.4, 3.3, 1.4, 0.9],
  // ];
  // console.log('nice', pca.predict(newPoints)); // project new points into the PCA space
//   return pca.U.data;
// }

//* importance
/// input: s - snapshot of db of the .../(userid)/essen_questions/
/// output: users' score list with importance
// TODO: need to improve the algorithm
function importance(s){
  const questions = Object.keys(s.val());
  questions.pop(); // pop 'done'
  const user_scores = questions.map(qid => s.child('/' + qid + '/score/').val());
  
  const rtn = questions.map((qid, index) => {
    if(s.child('/' + qid + '/importance/').val() === "yes"){
      return(user_scores[index] * 2) // double the score if it is important 
    }
    else return(user_scores[index])
  });

  return rtn;
}

//* team_building_algorithm
/// input: c - course id, round, n - number of teams
/// store team list with the user ids into DB
// TODO paired questions thing
function team_building_algorithm(c, round, n) {
  const dbRef = ref(getDatabase());
  const route = '/classes/' + c + '/user/';
  let user_list = [];
  let fun_scores = [];
  let user_scores = [];
  let dataset = [];
  let teammatelimit = 100;
  for(var i =0; i<classes.length; i++){ // set teammatelimit
    if(classes[i].code === c) {
      teammatelimit = classes[i].team;
      break;
    }
  }

  get(child(dbRef, route)).then((s) => {

    s.forEach((user) => {
      console.log("user: ", user.key)
      /// essential questions
      if(user.child('/essen_questions/done/').val() === 'yes') {
        user_list.push(user.key);
        user_scores = importance(user.child('/essen_questions/')); // apply the importance check
      }
      else{
        alert("user: " + user.key + "is not done on the quiz."); //TODO: wait til every users finish the quiz
      }
      /// fun questions
      if(round > 1){ /// round 2~
        if(user.child('/fun_questions/done/').val() === 'yes') {
          const questions = Object.keys(user.child('/fun_questions/').val());
          questions.pop(); // pop 'done'
          fun_scores = questions.map(qid => user.child('/fun_questions/' + qid + '/score/').val());
        }
        else{
          alert("user: " + user.key + "is not done on the quiz."); //TODO: wait til every users finish the quiz
        }
      
        const randomparameter = calculateRandomParameter(fun_scores);
        const tot_scores = user_scores.concat(randomparameter);
        dataset.push(tot_scores);
      }
      else{ /// round 1
        dataset.push(user_scores);
      }
      
    });

    console.log("final", user_list, dataset);
    const result = kmeans(dataset, n); 
    console.log(result.clusters);

    /// make teams with clustered result
    let teams = result.clusters.map(c => {
      if(c.points.length === 1){
        return [user_list[dataset.findIndex((e) => e === c.points[0])]];
      }
      else{
        const team = c.points.map(arr => user_list[dataset.findIndex((e) => e === arr)]);
        return team;
      }
    });

    /// adjusting number of team members to be under the limit of teammate
    for(var i=0; i<teams.length; i++){
      if(Array.isArray(teams[i]) && teams[i].length > teammatelimit){
        const arr1 = teams[i].slice(0, teammatelimit);
        const arr2 = teams[i].slice(teammatelimit);
        teams[i] = arr1;
        if(i === teams.length - 1) {
          if(Array.isArray(teams[0])) teams[0] = teams[0].concat(arr2);
          else teams[0] = [teams[0]].concat(arr2);
        }
        else {
          if(Array.isArray(teams[i+1])) teams[i+1] = teams[i+1].concat(arr2);
          else teams[i+1] = [teams[i+1]].concat(arr2);
        }
      }
    }
    for(i=0; i<teams.length-1; i++){
      if(Array.isArray(teams[i]) && teams[i].length > teammatelimit){
        const arr1 = teams[i].slice(0, teammatelimit);
        const arr2 = teams[i].slice(teammatelimit);
        teams[i] = arr1;
        if(Array.isArray(teams[i+1])) teams[i+1] = teams[i+1].concat(arr2);
        else teams[i+1] = [teams[i+1]].concat(arr2);
      }
    }

    /// store into DB
    const route2 = '/classes/' + c + '/rooms/';
    get(child(dbRef, route2)).then((s) => {
      if(s.child('/0/round/').val() !== round) {
        teams.forEach((team, index) => {
          set(ref(db, route2 + index + '/users'), team);
          set(ref(db, route2 + index + '/round'), round);
          set(ref(db, route2 + index + '/vote/total'), team.length);
        });
      }
    });
  }); 
}

export default team_building_algorithm;