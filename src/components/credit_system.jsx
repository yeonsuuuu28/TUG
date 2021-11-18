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
  const [tnames,setTnames] = useState([]);
  const [invert,setInvert] = useState([])



  const onPush = async(model) => {
    const auth = getAuth();
    const dbRef = ref(getDatabase());

    get(child(dbRef, "/users")).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val())
        setUserIds(snapshot.val());

       
        //console.log("current username: " + auth.currentUser.displayName)
        //console.log(userids)
        const tempName = Object.keys(userids) //all user ids in the system 
        //console.log(Object.values(userids))
        tempName.map((element) => {
          //userids[element] //displayname
          //element  //hashname

        //---------looks for the updated user in the db----------//
          //checks if there is a pastteams under user
          console.log(userids[element][Object.keys(userids[element])]) //print all users 

          if("pastteams" in userids[element][Object.keys(userids[element])]){ //pastteams
            //checks if there is a class id in user
            //console.log(userids[element][Object.keys(userids[element])].pastteams)
            if(classid in userids[element][Object.keys(userids[element])].pastteams ){ //class id CS 101
              console.log(userids[element][Object.keys(userids[element])].pastteams[classid]) //array of all CS 101
               //for loop?

               userids[element][Object.keys(userids[element])].pastteams[classid].map((index)=>{
                console.log(index)
               //names in pastteams that have data
               if(Object.keys(index).includes("name")){
                tnames.map((team) => {
                  console.log(team)
                  console.log(index.name)
                  console.log(index.id)
                  //if name of user is inside the class id, update the original user
                  if (index.name === team){
                    console.log("Yes")
                    //get current value
                    const target = "users/" +
                    index.id +
                    "/" +
                    index.name +
                    "/pastteams/" +
                    classid +"/0"
                    console.log("target:" + target)
                    console.log("credits: " + model[index.name])
                    get(child(dbRef,target)).then((snapshot) =>
                    {
                      if (snapshot.exists()) 
                        console.log(snapshot.val().credits)
                        set(
                          ref(
                            db,
                            target
                          ),
                          {credits: Number(snapshot.val().credits) + Number(model[index.name])}
                        );
                    })
                  }
                }
                )
                console.log(index)
               }
              
              //console.log(index.name,index.credit)
               if(userids[element].toString() === [index.name].toString()){
                 console.log("match")
               }
             })
              }
            }
              
          
          
        
          tnames.map((team) => {

            if(Object.keys(userids[element]).toString() === [team].toString()){ //if userid == teammate name
              console.log ("users/" +
                    element +
                    "/" +
                    team +
                    "/pastteams/" +
                    classid +"/0")
                //compute for user's credit 
            //  console.log(userids[element][team].pastteams[classid][0])
//set credit to some number
              // set(
              //   ref(
              //     db,
              //     "users/" +
              //       element +
              //       "/" +
              //       team +
              //       "/pastteams/" +
              //       classid +"/0"
              //   ),
              //   {credits:10}
              // );
              
              //console.log(Object.keys(userids[element]),[team])
              //console.log(element)
              element = "r0UNsRPIzGVO99ovbeiuilpTxIp2"
              team = "Cheryl Siy"
              get(child(dbRef, "/users")).then((snapshot) =>{ 
                if(snapshot.exists()){
                  //contains value of pastteams 
                 // console.log(snapshot.val())

                }
                else{
                  console.log("nodata")
                }

              })
              //update credits
             
            }
            
          })
         })

       
        // for (const i in tempName) {
        //   console.log(i)
        //   for (const j in tnames){
        //     if (i === j) //if name is in updated teammates
        //     console.log(i,j)
        //   }
        //   //for i in all user ids
        //   //if user is credited:
        //   //for (const j in tnames.lengt){}
        //   //console.log(i)

        //   //console.log("tnames:" + tnames[j]);
        //   //console.log(Object.keys(userids[0][i]));
        //   // if (Object.keys(userids[i]) === tnames[j]) {
        //   //   console.log("Success");
        //   //   console.log("tnames:" + tnames[j]);
        //   //   console.log(Object.keys(userids[0][i]));
        //   // }
        //   //console.log(i) //uid
        //   //console.log(Object.keys(.userids[0][i])) //displaynames
        //   get(
        //     child(dbRef, "users/" + i + "/" + Object.keys(userids[i]))
        //   ).then((snapshot) => {
        //     if (snapshot.exists()) {
        //       //console.log(snapshot.val().pastteams);

        //       for (const i in snapshot.val().pastteams) {
        //         //all items in pastteams[classid]
        //         for (const j in snapshot.val().pastteams[i]) {
        //           if (snapshot.val().pastteams[i][j]) {
        //             //console.log(snapshot.val().pastteams[i][j]); //pastteams[classid][index]
        //             if (snapshot.val().pastteams[i][j].name === currentUser) {
        //               setLocalCredit(
        //                 Number(localCredit) +
        //                   Number(snapshot.val().pastteams[i][j].credit)
        //               );
        //               setLocalCount((prevCount) => prevCount + 1);
        //             }
        //             //if(snapshot.val().pastteams[i][1].name === "Auejin"){
        //             //    console.log(snapshot.val().pastteams[i][1].credit)
        //             // }
        //           }
        //         }
        //       }
        //     } else {
        //     }
        //     //console.log(currentUser + " " + localCredit + " " + localCount);
        //   });
        // }

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
                { name: "Uxer Ham", credit: "0", id:"bPNyFc0pLFaNa2EB3NaIMK0CVZC2" },
                { name: "Yeon Su Park", credit: "0", id:"SbkyhYXe0iMEwKFMEQEQOW6dw273" },
                { name: "함어진", credit: "0", id:"n1ArKxSwv9ZoGoNU5guajQ6Ftq63" },
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
    let tempNames = [];
    //console.log(pastteams[0]);
    if (pastteams[0].length > 0) {
      // eslint-disable-next-line array-callback-return
      pastteams[0].map((element, index) => {
        //console.log(element);
        if ("name" in element) {
          tempNames.push(element.name);
          tempMembers.push({
            key: element.name,
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
      setTnames(tempNames);
    }
  }, [pastteams]);

  const onSubmit = (model) => {
    //window.location.assign("./mypage");

    //write to db updated values
    //1.build items to be written in DB
    onPush(model)

    update[0] = { credits: 0 };

    for (const i in pastteams[0]) {
      
      if (Object.keys(pastteams[0][i]).includes("name")) {
        update[i] = {
          name: pastteams[0][i].name,
          credit: model[pastteams[0][i].name],
          id:pastteams[0][i].id
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
       

        <button onClick={onPush}>Push </button>
      </div>
  
    </>
  );
};

export default ReadDB;
