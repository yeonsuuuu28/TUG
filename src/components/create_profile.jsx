import React, {useState} from 'react'
import Navbar from './navbar.jsx'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import "./create_profile.css"
import {auth, db} from "./firebase.jsx";
import { getDatabase, ref, get, child, set } from "firebase/database";

function profileAdd(x, y) {
  const dbRef = ref(getDatabase());
  get(child(dbRef, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/teambuilding/')).then((snapshot) => {
      if (snapshot.exists()) {
          classID = Object.values(snapshot.val());
          // console.log(classID);
          set(ref(db, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/class/' + classID), null)
          set(ref(db, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/class/' + classID + "/profile1/"), x)
          set(ref(db, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/class/' + classID + "/profile2/"), y)
          alert("Successfully saved");
          window.location.href = "/quizinfo/"+classID+'/1'
          }})}

function setclassID() {
  const dbRef = ref(getDatabase());
  get(child(dbRef, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/teambuilding/')).then((snapshot) => {
    classID = Object.values(snapshot.val());
    console.log(classID);
  })}

var taglist = [];
var taglist1 = [];
let classID = "";

export default function Profile() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [limit, setLimit] = useState(true)  
  const [open1, setOpen1] = useState(false);
  const [inputValue1, setInputValue1] = useState("");
  const [limit1, setLimit1] = useState(true)  
  


    return (
        <div>
            <Navbar/>
            {/* {setclassID} */}
            <br/>
            <div className="join_title">Create Your Profile</div>
            <div className="tag">
            <Autocomplete
                open={open}
                multiple
                freeSolo={limit}
                autoSelect
                options={taglist}
                disableClearable={false}
                onChange={(event, value) => {
                  if (value.length >= 3) {
                    value = value.slice(0, 3)
                    setLimit(false)
                    // console.log(value);
                    taglist = value
                    console.log(taglist);
                  }
                  else {
                    setLimit(true)
                  }
                  }}
                onOpen={() => {
                    if (inputValue) {
                      setOpen(false);
                    }
                    else {
                        setOpen(false)
                    }
                  }}
                onClose={() => setOpen(false)}
                onInputChange={(e, value, reason) => {
                    setInputValue(value);
          
                    if (!value) {
                      setOpen(false);
                    }
                  }}
                getOptionLabel={option => option.title || option}
                filterSelectedOptions
                renderInput={(params) => (
                <TextField
                    {...params}
                    label="Add Your Ability Tags"
                    placeholder=""
                />
                )}
            />
            <br/><br/>
            <Autocomplete
                open={open1}
                multiple
                freeSolo={limit1}
                autoSelect
                options={taglist1}
                disableClearable={false}
                onChange={(event, value) => {
                  if (value.length >= 3) {
                    value = value.slice(0, 3)
                    setLimit1(false)
                    taglist1 = value
                  }
                  else {
                    setLimit1(true)
                  }
                  }}
                onOpen={() => {
                    if (inputValue1) {
                      setOpen1(false);
                    }
                    else {
                        setOpen1(false)
                    }
                  }}
                onClose={() => setOpen1(false)}
                onInputChange={(e, value, reason) => {
                    setInputValue1(value);
          
                    if (!value) {
                      setOpen(false);
                    }
                  }}
                getOptionLabel={option => option.title || option}
                filterSelectedOptions
                renderInput={(params) => (
                <TextField
                    {...params}
                    label="Add Your Interesting Tags"
                    placeholder=""
                />
                )}
            />
        </div>
        <br/><br/>
        <button onClick={()=>
              // console.log(taglist)
              profileAdd(taglist, taglist1)
              }>Submit</button>
        {/* <button onClick={()=>{window.location.href = "/quizinfo/"+classID+'/1'}}></button> */}
        </div>
    )
}