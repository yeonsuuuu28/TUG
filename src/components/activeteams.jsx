import { auth, db } from "./firebase.jsx";
import { getDatabase, ref, get, child, set } from "firebase/database";
import { useState } from "react";

function ActiveTeamInfo({course, name}){
  console.log("doooo");
  const dbRef = ref(getDatabase());
  const route = 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/currentteams/' + course + '/';
  const [info, setInfo] = useState('Loading...');
  get(child(dbRef, route)).then((s)=> {
    if (s.exists()) {
      console.log(s.val());
      setInfo(s.val().map((i)=>{
        return(
          <tr key={i.name + i.email}>
            <td>{i.name}</td>
            <td>{i.email}</td>
          </tr>
        )
      }));
    }
  else {
      alert("something wrong,,, current teams data does not exist");
  }});

  return(
    <div>
      <button onClick={() => ActiveTeams()}>back</button>
      <div>{course}:{name}</div>
      <table>
        <thead>
          <tr>
            <th key='member'>MEMBER</th>
            <th key='CONTACT'>CONTACT</th>
          </tr>
        </thead>
        <tbody>
          {info}
        </tbody>
      </table>
    </div>
  )
}

function ActiveClass(props){
  console.log("activeclass:",props.course);
  const c = props.course;
  const dbRef = ref(getDatabase());
  const [ret, setRet] = useState('loading...');
  get(child(dbRef, '/classes/'+c+'/')).then((s)=> {
    const name = s.child('/name/').val();
    const prof =  s.child('/professor/').val();
    if(ret === 'loading...'){
      setRet(<div className = "activeclass" key={c+Math.random()}>
        <div>
          {name}
        </div>
        <div>
          {prof}
        </div>
        <button onClick={(c, name) => <ActiveTeamInfo course={c} name={name} />}>go</button>
      </div>);
    }
  });  

  
  return(
    <div>
      {ret}
    </div> 
  );
}

//* ActiveTeams - page '/activeteams',, component 'ActiveTeams' in mypage
function ActiveTeams() {
  const dbRef = ref(getDatabase());
  const route = 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/currentteams/' ;
  const [courseComponent, setCourseComponent] = useState('Loading...');
  get(child(dbRef, route)).then((s)=> {
    if (s.exists() && courseComponent == 'Loading...') {
      const courses = Object.keys(s.val());
      console.log('courses:', courses);
      get(child(dbRef, '/classes/')).then((s)=>{
        setCourseComponent(courses.map((c) => {
          const name = s.child('/'+c+'/name/').val();
          const prof =  s.child('/'+c+'/professor/').val();
          return(<div className = "activeclass" key={c+Math.random()}>
            <div>
              {name}
            </div>
            <div>
              {prof}
            </div>
            <button onClick={() => <ActiveTeamInfo course={c} name={name} />}>go</button>
          </div>);
        }));
      })
      // setCourseComponent(courses.map((c) => {
      //   get(child(dbRef, '/classes/'+c+'/')).then((s)=> {
      //     const name = s.child('/name/').val();
      //     const prof =  s.child('/professor/').val();
      //     return(<div className = "activeclass" key={c+Math.random()}>
      //       <div>
      //         {name}
      //       </div>
      //       <div>
      //         {prof}
      //       </div>
      //       <button onClick={(c, name) => <ActiveTeamInfo course={c} name={name} />}>go</button>
      //     </div>);
      //   });  
      // }
      // ));      
      return(
        <div>
          {courseComponent}
        </div>
      );
    }
    // else {
    //   alert("something wrong,,, current teams data does not exist2");
    // }
  });

  return(
    <div>
      {courseComponent}
    </div>
  )
}

export default ActiveTeams;