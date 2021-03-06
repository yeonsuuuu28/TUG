import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase.jsx";
import { getDatabase, ref, push, get, child, set } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import "./my_class.css";
import classes from "./classes_list.jsx";
import ERROR from "../images/error.png";

function handleCourseClick(course) {
  const dbRef = ref(getDatabase());
  get(child(dbRef, "classes/" + course + "/quizstarted")).then((snapshot) => {
      if (snapshot.exists()) {
        if (Object.values(snapshot.val())[0] === "y") {
          alert("Teambuilding session has already started. \nPlease contact your advisor.")
        }
      }
      else {
        push(ref(db,"users/" + auth.currentUser.uid + "/" + auth.currentUser.displayName + "/teambuilding/"), course);
        window.location.href = "/profile";
      }
    }
  );
}


  // console.log(course);
  
  // ).then((snapshot) => {
  //   if (snapshot.exists()) {
  //     if (Object.values(snapshot.val()) === course) {
  //       get(
  //         child(
  //           dbRef,
  //           "users/" +
  //             auth.currentUser.uid +
  //             "/" +
  //             auth.currentUser.displayName +
  //             "/class/" +
  //             course
  //         )
  //       ).then((snapshot) => {
  //         if (Object.keys(snapshot.val())[0] === "profile1") {
  //           alert(
  //             "You are already building a team for " +
  //               course +
  //               "." +
  //               "\nRedirecting to " +
  //               course +
  //               " quiz page..."
  //           );
  //           // window.location.href = "/quizinfo/"+course+'/1'; //TODO delete later
  //           window.location.href = "/waitingjoin/" + course+'/1';
  //         } else {
  //           alert(
  //             "You have not finished creating your profile for " +
  //               course +
  //               "." +
  //               "\nRedirecting to " +
  //               course +
  //               " profile page..."
  //           );
  //           window.location.href = "/profile";
  //         }
  //       });
  //     } else {
  //       get(
  //         child(
  //           dbRef,
  //           "users/" +
  //             auth.currentUser.uid +
  //             "/" +
  //             auth.currentUser.displayName +
  //             "/class/"
  //         )
  //       ).then((snapshot3) => {
  //         if (
  //           Object.keys(snapshot3.val()).includes(
  //             Object.values(snapshot.val())[0]
  //           )
  //         ) {
  //           get(
  //             child(
  //               dbRef,
  //               "users/" +
  //                 auth.currentUser.uid +
  //                 "/" +
  //                 auth.currentUser.displayName +
  //                 "/class/" +
  //                 Object.values(snapshot.val())[0]
  //             )
  //           ).then((snapshot2) => {
  //             if (Object.keys(snapshot2.val())[0] === "profile1") {
  //               alert(
  //                 "You are already building a team for " +
  //                   Object.values(snapshot.val())[0] +
  //                   "." +
  //                   "\nRedirecting to " +
  //                   Object.values(snapshot.val())[0] +
  //                   " quiz page..."
  //               );
  //               // window.location.href = "/quizinfo/"+ Object.values(snapshot.val())[0] +'/1';  //TODO delete later
  //               window.location.href =
  //                 "/waitingjoin/" + Object.values(snapshot.val())[0] + '/1';
  //             } else if (Object.values(snapshot2.val())[0] === "no profile") {
  //               alert(
  //                 "You have not finished creating your profile for " +
  //                   Object.values(snapshot.val())[0] +
  //                   "." +
  //                   "\nRedirecting to " +
  //                   Object.values(snapshot.val())[0] +
  //                   " profile page..."
  //               );
  //               window.location.href = "/profile";
  //             }
  //           });
  //         } else {
  //           set(
  //             ref(
  //               db,
  //               "users/" +
  //                 auth.currentUser.uid +
  //                 "/" +
  //                 auth.currentUser.displayName +
  //                 "/teambuilding/"
  //             ),
  //             null
  //           );
  //           alert(
  //             "You are no longer in " +
  //               Object.values(snapshot.val())[0] +
  //               " class." +
  //               "\nRedirection to my page..."
  //           );
  //           window.location.href = "/mypage";
  //         }
  //       });
  //     }
  //   } else {
  //     push(
  //       ref(
  //         db,
  //         "users/" +
  //           auth.currentUser.uid +
  //           "/" +
  //           auth.currentUser.displayName +
  //           "/teambuilding/"
  //       ),
  //       course
  //     );
  //     window.location.href = "/profile";
  //   }
  // });

export default function Join(props) {
  const classList = classes;
  const [joinedClass, setJoinedClass] = useState([]);
  const [uid, setUid] = useState("");
  const [username, setUserName] = useState("");
  const [table2, setTable2] = useState([]);
  const [table3, setTable3] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        setUserName(user.displayName);
      }
      if (auth.currentUser !== null) {
        const dbRef = ref(getDatabase());
        get(
          child(
            dbRef,
            "users/" +
              auth.currentUser.uid +
              "/" +
              auth.currentUser.displayName +
              "/current_teams/"
          )
        ).then((snapshot) => {
          if (snapshot.exists()) {
            setTable2(Object.keys(snapshot.val()));
          }
        });
        get(
            child(
              dbRef,
              "users/" +
                auth.currentUser.uid +
                "/" +
                auth.currentUser.displayName +
                "/pastteams/"
            )
          ).then((snapshot) => {
            if (snapshot.exists()) {
              setTable3(Object.keys(snapshot.val()));
            }
          });
          get(
            child(
              dbRef,
              "users/" +
                auth.currentUser.uid +
                "/" +
                auth.currentUser.displayName +
                "/teambuilding/"
            )
          ).then((snapshot) => {
            if (snapshot.exists()) {
              set(ref(db,"users/" + auth.currentUser.uid + "/" + auth.currentUser.displayName + "/teambuilding/"), null);
            }
          });
      }
    });
  }, [uid, username]);

  const getJoinedClass = () => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, "users/" + uid + "/" + username + "/class/")).then(
      (snapshot) => {
        if (snapshot.exists()) {
          setJoinedClass(Object.keys(snapshot.val()));
        } else {
          return;
        }
      }
    );
  };

  const display = () => {
    let classtable = [];
    for (var j = 0; j < classList.length; j++) {
      for (var i = 0; i < joinedClass.length; i++) {
        if (joinedClass[i] === classList[j].code) {
          let k = classList[j].code;
          if (table2.includes(k)) {
            continue;
          }
          if (table3.includes(k)) {
            continue;
          }
          if (classList[j].open === "Opened") {
            classtable.push(
                <tr key={i}>
                  <td className="table_class" key={i + 1}>
                    <div className="table_class_title">{classList[j].name}</div>
                    <div className="table_class_subtitle">
                      {classList[j].professor}{" "}
                    </div>
                    <div className="table_class_subtitle2">
                      Team of {classList[j].team} | {classList[j].open} for
                      Team-Building{" "}
                    </div>
                  </td>
                  <td className="table_join_button" key={i + 2}>
                    <div
                      className="start_button"
                      onClick={() => handleCourseClick(k)}
                      key={i + 3}
                    >
                      MAKE TEAM
                    </div>
                  </td>
                </tr>
              );
          } 
          else {
            classtable.push(
              <tr key={i}>
                <td className="table_class" key={i + 1}>
                  <div className="table_class_title">{classList[j].name}</div>
                  <div className="table_class_subtitle">
                    {classList[j].professor}{" "}
                  </div>
                  <div className="table_class_subtitle2">
                    Team of {classList[j].team} | {classList[j].open} for
                    Team-Building{" "}
                  </div>
                </td>
                <td className="table_join_button" key={i + 2}>
                  <div className="start_button2" key={i + 3}>
                    NOT OPENED
                  </div>
                </td>
              </tr>
            );
          }
        }
      }
    }
    if (classtable.length === 0) {
      return (
        <tr>
          <td>
            <div className="error2">
              <img src={ERROR} className="error" alt="" />
              <br />
              You have not joined any classes yet.
              <br />
              Please sign-in and join classes to start team-building!
            </div>
          </td>
        </tr>
      );
    }
    return classtable;
  };

  return (
    <React.Fragment>
      <div>
        <br />
        {getJoinedClass()}
        <table className="table_setting2">
          <tbody>{display()}</tbody>
        </table>
      </div>
    </React.Fragment>
  );
}
