import { auth, db } from "./firebase.jsx";
import { getDatabase, ref, get, child, set } from "firebase/database";
import { useState } from "react";

//* ActiveTeamInfo - subpage to show team information of each course
function ActiveTeamInfo({course, name}){
  // console.log("doooo");
  const dbRef = ref(getDatabase());
  const route = 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/current_teams/' + course + '/';
  const [info, setInfo] = useState('Loading...');
  const [onClick, setOnClick] = useState(false);
  get(child(dbRef, route)).then((s)=> {
    if (s.exists() && info === 'Loading...') {
      console.log(s.val());
      setInfo(s.val().map((i)=>{
        return(
          <tr key={i.name + i.email}>
            <td>{i.name}</td>
            <td>{i.email}</td>
          </tr>
        )
      }));
    }});

  if(onClick){ /// when the user clicked 'back' button
    return(
      <ActiveTeams />
    )
  }
  else{ /// when the user did not click 'back' button
    return(
      <div>
        <button onClick={() => setOnClick(true)}>back</button>
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

function handleClick(course, name){
  console.log("sdkfsdlkfsf");
  return(
<ActiveTeamInfo course={course} name={name} /> 
)
}

//* ActiveTeams - page '/activeteams',, component 'ActiveTeams' in mypage
function ActiveTeams() {
  const dbRef = ref(getDatabase());
  const route = 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/current_teams/' ;
  const [courseComponent, setCourseComponent] = useState('Loading...');
  const [onClick, setOnClick] = useState([false, '', '']);

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
            <button onClick={() => setOnClick([true, c, name])}>go</button>
          </div>);
        }));
      })
    }
  });

  if(onClick[0]){ /// when the user clicked 'go' button
    console.log("onClick: ", onClick);
    // setOnClick([false, '', '']);
    return(
      <div>
        <ActiveTeamInfo course={onClick[1]} name={onClick[2]} /> 
      </div>
    )
  }
  else{ /// when the user did not click 'go' button
    return(
      <div>
        {courseComponent}
      </div>
    )
  }
}

export default ActiveTeams;