import React, { useEffect, useState } from 'react'
import {auth, db} from "./firebase.jsx";
import { getDatabase, ref, push, get, child } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import './start_team_building.css';

//* handleCourseClick - go to quiz session when the course 'open' button is clicked.
function handleCourseClick(course){
  const dbRef = ref(getDatabase());
  get(child(dbRef, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/teambuilding/')).then((snapshot) => {
      if (snapshot.exists()) {
          if (Object.values(snapshot.val())[0] === course) {
            get(child(dbRef, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/class/' + course)).then((snapshot) => {
            if (Object.keys(snapshot.val())[0] === "profile1") {
              alert("You are already building a team for " + course + "."
              + "\nRedirecting to " + course + " quiz page...")
              // window.location.href = "/quizinfo/"+course+'/1'; //TODO delete later
              window.location.href = "/waitingjoin/"+course;
              }
            else {
              alert("You have not finished creating your profile for " + course + "."
              + "\nRedirecting to " + course + " profile page...")
              window.location.href = "/profile"
              }});
            }
          else {
              get(child(dbRef, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/class/' + course)).then((snapshot) => {
              if (Object.keys(snapshot.val())[0] === "profile1") {
                alert("You are already building a team for " + course + "."
                + "\nRedirecting to " + course + " quiz page...")
                window.location.href = "/waitingjoin/"+Object.keys(snapshot.val())[0];
                // window.location.href = "/quizinfo/"+ Object.keys(snapshot.val())[0] +'/1'; //TODO delete later
                }
              else {
                alert("You have not finished creating your profile for " + course + "."
                + "\nRedirecting to " + course + " profile page...")
                window.location.href = "/profile"
                }});
              }
          }
      else {
          push(ref(db, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/teambuilding/'), course)
          window.location.href = "/profile"
      }})
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
        // console.log("identified ", uid, username);
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

  if (uid && username) {
    const dbRef = ref(getDatabase());
    const route = '/users/' + uid + '/' + username + '/class/';
    get(child(dbRef, route)).then((snapshot) => {
      if(snapshot.exists() && courseObjects === 'loading...'){
        const courseid = Object.keys(snapshot.val());
        get(child(dbRef, '/classes/')).then((s)=> {
          if(s.exists()){
            setCourseName(courseid.map(id => {
              if(s.child(id + '/quizstarted/').val() != 'yes'){
                return (s.child(id + '/name/').val());
              }
              else return ('blabla');
            }));
            setCourseProf(courseid.map(id => {
              if(s.child(id + '/quizstarted/').val() != 'yes'){
                return (s.child(id + '/professor/').val());
              }
              else return ('blabla');
            }));
            // setCourseProf(courseid.map(id => s.child(id + '/professor/').val()));  
            setCourseObjects(courseid.map((id, index) => {
              if(s.child(id + '/quizstarted/').val() != 'yes'){
                return (
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
                );
              }
            }));
            // setCourseObjects((courseid).map((id, index) => 
            //   <li className = "course" key = {id}>
            //     <ul>
            //       <li className='coursedescription'>
            //         <div className = "coursename">{id}: {courseName[index]}</div>
            //         <div className='courseprof'>{courseProf[index]}</div>
            //       </li>
            //       <li>
            //         <button onClick={() => handleCourseClick(id)} className='join_quiz'>Start</button> {/*//TODO Start only when it's ready to start quiz */}
            //       </li>
            //     </ul>
            //   </li>
            // ));
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
