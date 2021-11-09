import React, { useEffect, useState } from 'react'
import Navbar from './navbar.jsx'
import {auth, db} from "./firebase.jsx";
import { getDatabase, ref, push, get, child, set } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

//* handleCourseClick
function handleCourseClick(){
  //TODO
}

// function UserIdentification(){
  
// };

//* GetCourseList
/// input: none
/// output: <html> - set of courses
function GetCourseList(){  
  const [uid, setUid] = useState('');
  const [username, setUserName] = useState('');
  let courseObjects = "loading...";

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        setUserName(user.displayName);
      }
    });
  }, [])

  if(uid && username) {
    alert("good "+uid+username);
    const dbRef = ref(getDatabase());
    const route = '/users/' + uid + '/' + username + '/class/';
    get(child(dbRef, route)).then((snapshot) => {
      if(snapshot.exists()){
        courseObjects = Object.values(snapshot.val()).map(course => 
          <li className = "course" key = {course}>
            {course}
            <button onClick={handleCourseClick} className='join_quiz'>Open</button>
          </li>
        );
        console.log(courseObjects);
      }
      else{ // TODO
        alert("wrong");
        return(<div>something wrong1</div>)
      }
    });
  }
  else{
    return(<div>loading...</div>)
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
      <GetCourseList />
    </div>
  )    
};

export default start_team_building
