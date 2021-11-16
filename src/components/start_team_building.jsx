import React, { useEffect, useState } from 'react'
import {auth, db} from "./firebase.jsx";
import { getDatabase, ref, push, get, child } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import './start_team_building.css';
// import { essenQcandidates, essenAcandidates, funQcandidates, funAcandidates } from './question_candidates'

//* handleCourseClick - go to quiz session when the course 'open' button is clicked.
function handleCourseClick(course){
  const dbRef = ref(getDatabase());
  get(child(dbRef, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/teambuilding/')).then((snapshot) => {
      if (snapshot.exists()) {
          if (Object.values(snapshot.val())[0] === course) {
            alert("You have not finished creating your profile")
            window.location.href = "/profile"
          }
          else {
            alert("You are already building a team for another class") //TODO
            window.location.href = "/profile"
          }
          // console.log(Object.values(snapshot.val()));
          }
      else {
          push(ref(db, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/teambuilding/'), course)
          window.location.href = "/profile"
      }})
      
      // window.location.href = "/quizinfo/"+course+'/1'; //Make Profile First and Enter Quiz. 
}

//* UserIdentification - identify the user and load the GetCourseList component.
function UserIdentification(){
  const [uid, setUid] = useState('');
  const [username, setUserName] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        setUserName(user.displayName);
        console.log("identified ", uid, username);
      }
    });
  }, [uid, username])

  return (
    <GetCourseList uid={uid} username={username} />
  );
};

//* GetCourseList
/// input: none
/// output: <html> - set of courses
function GetCourseList({ uid, username }){

  const [courseObjects, setCourseObjects] = useState('loading...');
  const [courseName, setCourseName] = useState([]);
  const [courseProf, setCourseProf] = useState([]);

  if(uid && username) {
    const dbRef = ref(getDatabase());
    const route = '/users/' + uid + '/' + username + '/class/';
    get(child(dbRef, route)).then((snapshot) => {
      if(snapshot.exists() && courseObjects === 'loading...'){
        const courseid = Object.keys(snapshot.val());
        
        get(child(dbRef, '/classes/')).then((s)=> {
          if(s.exists()){
            setCourseName(courseid.map(id => s.child(id + '/name/').val()));
            setCourseProf(courseid.map(id => s.child(id + '/professor/').val()));  

            setCourseObjects((courseid).map((id, index) => 
              <li className = "course" key = {id}>
                <ul>
                  <li className='coursedescription'>
                    <div className = "coursename">{id}: {courseName[index]}</div>
                    <div className='courseprof'>{courseProf[index]}</div>
                  </li>
                  <li>
                    <button onClick={() => handleCourseClick(id)} className='join_quiz'>Start</button> {/*//TODO Start only when it's ready to start quiz */}
                  </li>
                </ul>
              </li>
            ));
            console.log(courseObjects);
            console.log(courseName, courseProf);

          }
          else{
            alert("no class"); //TODO
          }
        });
      }
    });
  }

  return(
    <ul id="course-list">
      {courseObjects}
    </ul>
  )
};

const start_team_building = () => {
  return(
    <div>
      <UserIdentification />
    </div>
  )    
};

export default start_team_building
