import React from 'react';
import { auth } from "./firebase.jsx";
import { getDatabase, ref, get, child } from "firebase/database";
import { useState } from "react";
import "./activeteams.css";
import ERROR from "../images/error.png";



function PastTeamInfo({ course, name }) {
  const dbRef = ref(getDatabase());
  const route =
    "users/" +
    auth.currentUser.uid +
    "/" +
    auth.currentUser.displayName +
    "/pastteams/" +
    course +
    "/";
  const [info, setInfo] = useState("Loading...");
  const [onClick, setOnClick] = useState(false);
  const [teamMates, setTeamMates] =useState();
  get(child(dbRef, route)).then((s) => {
    if (s.exists() && info === "Loading...") {
      //console.log(s.val());
      setTeamMates(s.val());

      setInfo(
        s.val().map((i) => {
          return (
            <>
                <tr key={i.name + i.email}>
                  <td>{i.name}</td>
                  <td>{i.credit}</td>
                </tr>
            </>
          );
        })
      );
    }
  });

  if (onClick) {
    /// when the user clicked 'back' button
    return <PastTeams />;
  } else {
    console.log(teamMates);
    console.log(info)
    //const aveCredit = teamMates[0].credits
    /// when the user did not click 'back' button
    let aveCredit = 0
    if(teamMates){
       aveCredit = teamMates[0].credits;
    }
    return (
      <div>
        <button onClick={() => setOnClick(true)}>back</button>
        <div>
          {course}:{name}
        </div>
        <div>Your Average Credits: {aveCredit}</div>
        <table>
          <thead>
            <tr>
              <th key="member">MEMBER</th>
              <th key="grade">CREDIT</th>
            </tr>
            </thead>
            <tbody>
              {info}
            </tbody>
        </table>
      </div>
    );
  }
}




const PastTeams = () => {

const initial = [
  "Loading...",
  <div className="error4">
    <img src={ERROR} className="error3" alt="" />
    <br />
    You have no Active Team yet :(
  </div>,
];
const [courseComponent, setCourseComponent] = useState(initial[0]);
const [onClick, setOnClick] = useState([false, "", ""]);

if (auth.currentUser === null) {
  return (
    <div className="error4">
      <img src={ERROR} className="error3" alt="" />
      <br />
      Please sign-in to see your past teams.
    </div>
  );
} else {
  const dbRef = ref(getDatabase());
  const route =
    "users/" +
    auth.currentUser.uid +
    "/" +
    auth.currentUser.displayName +
    "/pastteams/";

  get(child(dbRef, route)).then((s) => {
    if (
      s.exists() &&
      (courseComponent === initial[0] || courseComponent === initial[1])
    ) {
      const courses = Object.keys(s.val());
      console.log("courses:", courses);
      get(child(dbRef, "/classes/")).then((s) => {
        setCourseComponent(
          courses.map((c) => {
            const name = s.child("/" + c + "/name/").val();
            const prof = s.child("/" + c + "/professor/").val();
            console.log(name,prof)
            return (
              <table key = {name+prof} className="hahahatest">
                <tbody>
                  <tr key = {name}>
                    <td className="collapse">{name}</td>
                  </tr>
                  <tr key = {prof}>
                    <td className="hahatest">
                      {prof}&nbsp;&nbsp;&nbsp;
                      <i className="fas fa-arrow-alt-circle-right"></i>
                      <button onClick={() => setOnClick([true, c, name])}>
                        go
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            );
          })
        );
      });
    } else if (!s.exists()) {
      setCourseComponent(initial[1]);
      // setCourseComponent()
    }
  });

  if (onClick[0]) {
    /// when the user clicked 'go' button
    console.log("onClick: ", onClick);
    // setOnClick([false, '', '']);
    return (
      <div>
        <PastTeamInfo course={onClick[1]} name={onClick[2]} />
      </div>
    );
  } else {
    /// when the user did not click 'go' button
    return <div>{courseComponent}</div>;
  }
}
}
export default PastTeams