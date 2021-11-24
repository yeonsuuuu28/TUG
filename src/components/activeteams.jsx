import { auth } from "./firebase.jsx";
import { getDatabase, ref, get, child } from "firebase/database";
import { useState } from "react";
import "./activeteams.css"
import ERROR from "../images/error.png"

function handleclick(course) {
  console.log(course)
  window.location.href = "/credit/" + course
}

//* ActiveTeamInfo - subpage to show team information of each course
function ActiveTeamInfo({course, name}){
  const dbRef = ref(getDatabase());
  const route = 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/current_teams/' + course + '/';
  const [info, setInfo] = useState('Loading...');
  const [onClick, setOnClick] = useState(false);
  get(child(dbRef, route)).then((s)=> {
    if (s.exists() && info === 'Loading...') {
      console.log(s.val());
      setInfo(s.val().map((i)=>{
        return(
          <>
         
          <tr key={i.name + i.email}>
            <td>{i.name}</td>
            <td>{i.email}</td>
          </tr>
    
          </>
        );
      }));
    }
  });

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
        <button onClick={() => handleclick(course)}>DONE</button>
      </div>
    )
  }
  
}


//* ActiveTeams - page '/activeteams',, component 'ActiveTeams' in mypage
function ActiveTeams() {
  const initial = ['Loading...', <div className="error4"><img src = {ERROR} className = "error3" alt=""/><br/>You have no Active Team yet :(</div> ];
  const [courseComponent, setCourseComponent] = useState(initial[0]);
  const [onClick, setOnClick] = useState([false, '', '']);
  

  if (auth.currentUser === null) {
    return (
      <div className="error4">
      <img src = {ERROR} className = "error3" alt=""/><br/>
      Please sign-in to see your active teams.
      </div>
    )
  }
  else {
    const dbRef = ref(getDatabase());
    const route = 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/current_teams/' ;

    get(child(dbRef, route)).then((s)=> {
      if (s.exists() && (courseComponent === initial[0] || courseComponent === initial[1])) {
        const courses = Object.keys(s.val());
        console.log('courses:', courses);
        get(child(dbRef, '/classes/')).then((s)=>{
          setCourseComponent(courses.map((c) => {
            const name = s.child('/'+c+'/name/').val();
            const prof =  s.child('/'+c+'/professor/').val();
            return(
            <table className="hahahatest">
              <tbody>
                <tr>
                  <td className ="collapse">
                    {name}
                  </td>
                </tr>
                <tr>
                  <td className="hahatest">
                    {prof}&nbsp;&nbsp;&nbsp;<i className="fas fa-arrow-alt-circle-right"></i>
                    <button onClick={() => setOnClick([true, c, name])}>go</button>
                  </td>
                </tr>
              </tbody>
            </table>
            );
          }));
        })
      }
      else if(!s.exists()) {
        setCourseComponent(initial[1]);
        // setCourseComponent()
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
}

export default ActiveTeams;