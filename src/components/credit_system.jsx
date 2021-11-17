import { useState, useEffect, useCallback } from "react";
import Navbar from "./navbar.jsx";
import "./credit.css";
import DynamicForm from "./DynamicForm";
import { auth, db } from "./firebase.jsx";
import { getDatabase, ref, get, child, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const update = [{}];
const classid = "CS101";
const tnames = [];

const ReadDB = ({ params }) => {
  // const course = params.course
  const [data, setData] = useState([
    { name: "Uxer Ham", point: 0 },
    { name: "Yeon Su Park", point: 0 },
    { name: "조성혜", point: 0 },
  ]);
  const [pastteams, setPastTeams] = useState([]);
  const [userids, setUserIds] = useState([]);
  const [localCredit, setLocalCredit] = useState();
  const [localCount, setLocalCount] = useState(0);
  const [members, setMembers] = useState([]);

  const onPush = (e) => {
    const auth = getAuth();
    const dbRef = ref(getDatabase());

    get(child(dbRef, "users")).then((snapshot) => {
      if (snapshot.exists()) {
        setUserIds([snapshot.val()]);

        //get all users keys
        //uid = Object.keys(.userids[0])
        //name = Object.values(.userids[0])
        //console.log(uid[0])
        var j = 0;
        console.log("current username: " + auth.currentUser.displayName);
        const currentUser = "Yeonsu";
        for (const i in userids[0]) {
          //for i in all user ids
          //if user is credited:
          //for (const j in tnames.lengt){}
          console.log("tnames:" + tnames[j]);
          console.log(Object.keys(userids[0][i]));
          if (Object.keys(userids[0][i]) === tnames[j]) {
            console.log("Success");
            console.log("tnames:" + tnames[j]);
            console.log(Object.keys(userids[0][i]));
          }
          //console.log(i) //uid
          //console.log(Object.keys(.userids[0][i])) //displaynames
          get(
            child(dbRef, "users/" + i + "/" + Object.keys(userids[0][i]))
          ).then((snapshot) => {
            if (snapshot.exists()) {
              console.log(snapshot.val().pastteams);

              for (const i in snapshot.val().pastteams) {
                //all items in pastteams[classid]
                for (const j in snapshot.val().pastteams[i]) {
                  if (snapshot.val().pastteams[i][j]) {
                    console.log(snapshot.val().pastteams[i][j]); //pastteams[classid][index]
                    if (snapshot.val().pastteams[i][j].name === currentUser) {
                      setLocalCredit(
                        Number(localCredit) +
                          Number(snapshot.val().pastteams[i][j].credit)
                      );
                      setLocalCount((prevCount) => prevCount + 1);
                    }
                    //if(snapshot.val().pastteams[i][1].name === "Auejin"){
                    //    console.log(snapshot.val().pastteams[i][1].credit)
                    // }
                  }
                }
              }
            } else {
            }
            console.log(currentUser + " " + localCredit + " " + localCount);
          });
        }

        /*for (const i in Object.keys(.userid[0])){
                    
                }*/
      } else {
      }
    });
  };

  const dbRead = async () => {
    const auth = getAuth();
    const dbRef = ref(getDatabase());
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        //read db
        console.log("readdb");

        get(
          child(
            dbRef,
            "users/" + uid + "/" + auth.currentUser.displayName + "/classes"
          )
        )
          .then((snapshot) => {
            if (snapshot.exists()) {
              //console.log(snapshot.val())
              // this.setState({
              //     test:[snapshot.val()]
              // })
              //console.log("hello" + .test)
            } else {
              //console.log("no data");
            }
          })
          .catch((error) => {
            console.error(error);
          });

        //get past teams
        get(
          child(
            dbRef,
            "users/" +
              uid +
              "/" +
              auth.currentUser.displayName +
              "/currentteams/" +
              classid
          )
        ).then((snapshot) => {
          if (snapshot.exists()) {
            //alert("copying pastteams to past")
            //const data1 = snapshot.val()
            setPastTeams([snapshot.val()]);

            //alert("dbread")
            //get data to database
            //  console.log(.pastteams[0][3].credit)
          } else {
            //add in data
            alert("no data, pushing dummy data ");
            set(
              ref(
                db,
                "users/" +
                  uid +
                  "/" +
                  auth.currentUser.displayName +
                  "/currentteams/" +
                  classid
              ),
              [
                { credits: "0" },
                { name: "Uxer Ham", credit: "0" },
                { name: "Yeon Su Park", credit: "0" },
                { name: "조성혜", credit: "0" },
              ]
            );
          }
        });
        //get all user id
        return "done";
      }
      // ...
      else {
        alert("not signed in");
        // User is signed out
        // ...
      }
    });
  };

  const fillModel = useCallback(() => {
    console.log("fill");
    let tempMembers = [];
    console.log(pastteams[0]);
    if (pastteams[0].length > 0) {
      pastteams[0].map((element, index) => {
        console.log(element);
        if ("name" in element) {
          tnames.push(element.name);
          tempMembers.push({
            key: "user" + index,
            label: element.name,
            type: "number",
            props: {
              min: 0,
              max: 100,
              required: true,
            },
          });
        }
      });
      setMembers(tempMembers);
    }
  }, [pastteams]);

  const onSubmit = (model) => {
    //alert(JSON.stringify(model[.pastteams[0][1].name])); // displays points allocated for 1st person

    //debugging stuff
    /*this.setState({
            data:[model, ....data]
        })
        this.setState({
            output:[model]
        })
       
        alert(JSON.stringify(.output[0]));
        console.log(.pastteams[0][3].credit)
        */
    //redirect
    window.location.assign("./mypage");

    //write to db updated values
    //1.build items to be written in DB

    update[0] = { credits: 0 };

    for (const i in pastteams[0]) {
      if (Object.keys(pastteams[0][i]).includes("name")) {
        update[i] = {
          name: pastteams[0][i].name,
          credit: model[pastteams[0][i].name],
        };
      }
    }
    //console.log(update)
    //2.write to db
    set(
      ref(
        db,
        "users/" +
          auth.currentUser.uid +
          "/" +
          auth.currentUser.displayName +
          "/pastteams/" +
          classid
      ),
      update
    );

    //update past average

    //delete /current teams + classid
    set(
      ref(
        db,
        "users/" +
          auth.currentUser.uid +
          "/" +
          auth.currentUser.displayName +
          "/currentteams/" +
          classid
      ),
      null
    );

    alert(
      "Thank you for submitting an honest review! Credits are now updated Successfully"
    );

    //redirect to another page
  };

  useEffect(() => {
    dbRead();
  }, []);

  useEffect(() => {
    if (pastteams[0]?.length > 0) {
      fillModel();
    }
  }, [pastteams, fillModel]);

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div>
        <DynamicForm
          className="form"
          title="Credit"
          model={members}
          //sample structure of the model = members
          // model = {[
          //     {key:"auejin", label:"auejin", type: "number", props: {min:0, max:100, required:true}},
          //     {key:"yeonsu", label:"Yeonsu", type: "number", props: {min:0, max:100,required:true}},
          //     {key:"seonghye", label:"Seonghye", type: "number", props: {min:0, max:100,required:true}}
          // ]}

          onSubmit={(model) => {
            onSubmit(model);
          }}
        />
        {/*}
            <pre style ={{width:"100"}}>
                {JSON.stringify(.test)}
                {JSON.stringify(this.model)}
                Inputdata: {JSON.stringify(.pastteams)}    
            </pre>

            <div>
                Output data: {JSON.stringify(.output)}
            </div>  */}

        <button onClick={onPush}>Push </button>
      </div>
      {/*     
        <div className = "credit">
        <table>
        <tr>
          <th>Members</th>
          <th>Points</th>
        </tr>
        {data.map((val, key) => {
          return (
            <tr key={key}>
              <td>{val.name}</td>
              <td><form>
                <label>{val.name}
                    <NameForm/>
                    <input type="number" onChange="" placeholder="0" />
                </label>
                </form>
     </td>
            </tr>
          )
        })}
      </table>
            </div>
            */}
    </>
  );
};

export default ReadDB;
