import React, { useEffect, useState, Link } from 'react'
import Navbar from './navbar.jsx'
import {auth, db} from "./firebase.jsx";
import { getDatabase, ref, push, get, child, set } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

//* handleCourseClick
function handleCourseClick(){
  //TODO
}

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
        setCourseObjects(Object.values(snapshot.val()).map(course => 
          <li className = "course" key = {course}>
            {course}
            <Link to="./quiz" params={{ course:{course} }}>Open</Link>
            {/* <button onClick={handleCourseClick} className='join_quiz'>Open</button> //TODO Open only when it's ready to start quiz */}
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
