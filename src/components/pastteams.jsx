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
          if (i.name !== undefined){
          return (
                <tr key={i.name + i.email}>
                  <td className = "contactName">{i.name}</td>
                  <td className = "contactEmail">{i.credit}</td>
                </tr>
          );
          }
          return (<></>)
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
    // let aveCredit = 0
    // if(teamMates){
    //    aveCredit = teamMates[0].credits;
    // }
    return (
      <div>
        <i className="fas fa-arrow-alt-circle-left back_button" onClick={() => setOnClick(true)}></i>
        {/* <button onClick={() => setOnClick(true)}>back</button> */}
        <div className = "contactTitle">{name}</div>
        {/* <div>Your Average Credits: {aveCredit}</div> */}
        <table className = "contactTable">
          <tbody>
            <tr>
              <td key="member" className = "headerMember">MEMBER</td>
              <td key="grade" className = "headerContact">CREDIT</td>
            </tr>
            {info}
            </tbody>
        </table>
        <div className="notification">Please visit <b>profile tab</b> to view your total credit!</div>
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
    You have no past teams yet :(
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
              <table key = {name+prof} className="table_setting3">
                <tbody>
                  <tr key = {name}>
                    <td className="table_class">
                    <div className="table_class_title">{name}</div>
                    <div className="table_class_subtitle">{prof}{" "}</div>
                    </td>
                    <td className="table_join_button" key={2}>
                    <div className="view_button" onClick={() => setOnClick([true, c, name])}>VIEW CREDIT HISTORY</div>
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