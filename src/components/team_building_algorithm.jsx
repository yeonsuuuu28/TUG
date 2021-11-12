import { auth, db } from "./firebase.jsx";
import { getDatabase, ref, push, get, child, set } from "firebase/database";
import kmeans from './kmeans.jsx';

//* calculateRandomParameter
/// input: course - course id, s - snapshot of DB of .../fun_questions
/// output: value of random parameter
function calculateRandomParameter(fun_scores){
  const randomness = 0.5;
  return randomness * fun_scores.reduce((a, b) => a+b, 0);
}

//* PCA
/// input: dataset - dataset is a two-dimensional array where rows represent the samples and columns the features
/// output: dataset after PCA dimension reduction
function PCA(dataset) {
  const { PCA } = require('ml-pca');
  const a = [[0,0,0,0,0], [1,1,1,1,1], [20,20,20,20,20], [23,23,23,23,23]];
  const b = a[0].map((_, colIndex) => a.map(row => row[colIndex])); // transpose

  const pca = new PCA(a);
  // const pca = new PCA(dataset);
  // console.log("hello", pca.getExplainedVariance());
  console.log(pca);
  // const newPoints = [
  //   [4.9, 3.2, 1.2, 0.4],
  //   [5.4, 3.3, 1.4, 0.9],
  // ];
  // console.log('nice', pca.predict(newPoints)); // project new points into the PCA space
  return pca.U.data;
}

//* importance
/// input: user_scores - score list of the user, s - snapshot of db of the .../(userid)/essen_questions/
/// output: user_scores with importance
// TODO: need to improve the algorithm
function importance(s){
  const questions = Object.keys(s.val());
  questions.pop(); // pop 'done'
  const user_scores = questions.map(qid => s.child('/' + qid + '/score/').val());
  
  const rtn = questions.map((qid, index) => {
    if(s.child('/' + qid + '/importance/').val() === "yes"){
      return(user_scores[index] * 2)
    }
    else return(user_scores[index])
  });

  console.log('user_scores: ', user_scores);
  console.log('importance: ', rtn);

  return rtn;
}

//* team_building_algorithm
/// input: c - course id, n - number of teams
/// output: teams - team list with the user ids
const team_building_algorithm = (c, n) => {
  const dbRef = ref(getDatabase());
  const route = '/classes/' + c + '/user/';
  let user_list = [];
  let fun_scores = [];
  let user_scores = [];
  let dataset = [];

  get(child(dbRef, route)).then((s) => {
    s.forEach((user) => {
      console.log("a", user.key)
      /// essential questions
      if(user.child('/essen_questions/done/').val() === 'yes') {
        user_list.push(user.key);
        // const questions = Object.keys(user.child('/essen_questions/').val());
        // questions.pop(); // pop 'done'
        // user_scores = questions.map(qid => user.child('/essen_questions/' + qid + '/score/').val());
        user_scores = importance(user.child('/essen_questions/')); // apply the importance 
        console.log(user_scores);
      }
      else{
        alert("user: " + user.key + "is not done on the quiz."); //TODO: wait til every users finish the quiz
      }
      /// fun questions
      // if(user.child('/essen_questions/done/').val() === 'yes') {
      //   user_list.push(user.key);
      //   const questions = Object.keys(user.child('/essen_questions/').val());
      //   questions.pop(); // pop 'done'
      //   essen_scores.push(questions.map(qid => user.child('/essen_questions/' + qid + '/score/').val()));
      // }
      // else{
      //   alert("user: " + user.key + "is not done on the quiz."); //TODO: wait til every users finish the quiz
      // }
    
      const randomparameter = calculateRandomParameter(fun_scores);
      const tot_scores = user_scores.concat(randomparameter);
      dataset.push(tot_scores);
    });

    // console.log("dataset bef: ", dataset);
    // dataset = dataset[0].map((_, colIndex) => dataset.map(row => row[colIndex])); // transpose

    // console.log("dataset: ", dataset);

    console.log("final", user_list, dataset);
    const result = kmeans(dataset, 2); // TODO: change 2 -> n
    console.log(result.clusters);

    const teams = result.clusters.map(c => {
      if(c.points.length === 1){
        // console.log(dataset);
        // console.log("sd", c.points, dataset.findIndex((e) => e === c.points[0]));
        return user_list[dataset.findIndex((e) => e === c.points[0])]
      }
      else{
        // console.log("sd", c.points, dataset.findIndex((e) => e === c.points[0]));
        const team = c.points.map(arr => user_list[dataset.findIndex((e) => e === arr)]);
        // console.log("last", team);
        return team;
      }
    });

    return teams;
  });

  
}

// export {calculateRandomParameter, PCA, generateDataset}
export default team_building_algorithm;