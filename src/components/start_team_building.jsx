import React, { useEffect, useState, Link } from 'react'
import Navbar from './navbar.jsx'
import {auth, db} from "./firebase.jsx";
import { getDatabase, ref, push, get, child, set } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import './start_team_building.css';

//* handleCourseClick - go to quiz session when the course 'open' button is clicked.
function handleCourseClick(course){
  window.location.href = "/quiz/"+course;
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
  }, [])

  return (
    <GetCourseList uid={uid} username={username} />
  );
};

//* GetCourseList
/// input: none
/// output: <html> - set of courses
function GetCourseList({ uid, username }){

  const [courseObjects, setCourseObjects] = useState('loading...');
  
  if(uid && username) {
    const dbRef = ref(getDatabase());
    const route = '/users/' + uid + '/' + username + '/class/';
    get(child(dbRef, route)).then((snapshot) => {
      if(snapshot.exists() && courseObjects == 'loading...'){
        const courseid = Object.values(snapshot.val());
        get(child(dbRef, '/classes/')).then((snapshot)=> {
          if(snapshot.exists()){
            const coursename = courseid.map(id => {
              console.log(snapshot.child(id + '/name').key)
            })
          }
          else{
            alert("no class"); //TODO
          }
        }
        )
        

        setCourseObjects(Object.values(snapshot.val()).map(course => 
          <li className = "course" key = {course}>
            {course}
            <button onClick={() => handleCourseClick(course)} className='join_quiz'>Start</button> {/*//TODO Start only when it's ready to start quiz */}
          </li>
        ));
        console.log(courseObjects);
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
      <Navbar />
      <UserIdentification />
    </div>
  )    
};

export default start_team_building
