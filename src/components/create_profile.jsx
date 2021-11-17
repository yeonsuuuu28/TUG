import React, {useState} from 'react'
import Navbar from './navbar.jsx'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import "./create_profile.css"
import {auth, db} from "./firebase.jsx";
import { getDatabase, ref, get, child, set } from "firebase/database";
import { styled } from '@mui/material/styles';

const TagsTags = styled(Autocomplete)({
  '& 	label': {
      // fontSize: 14,
      fontFamily: "Lato",
      alignContent: "center",
      color: "#bebebe"
  }});

function profileAdd(x, y) {
    console.log(taglist)
    console.log(taglist1)
    const dbRef = ref(getDatabase());
    get(child(dbRef, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/teambuilding/')).then((snapshot) => {
      if (snapshot.exists()) {
          classID = Object.values(snapshot.val());
          set(ref(db, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/class/' + classID), null)
          if ((x.length === 3) && (y.length === 3)) {
            set(ref(db, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/class/' + classID + "/profile1/"), x)
            set(ref(db, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/class/' + classID + "/profile2/"), y)
            alert("Successfully saved");
            window.location.href = "/quizinfo/" + classID + '/1'
            }
          else {
            alert("Please add 3 tags for each!")
            window.location.href = "/profile"
            }
          }})

  }


// function setclassID() {
//   const dbRef = ref(getDatabase());
//   get(child(dbRef, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/teambuilding/')).then((snapshot) => {
//     classID = Object.values(snapshot.val());
//     console.log(classID);
//   })}

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
            <div className="profile_title">Create Your Profile</div><br/>
            <div className="tag">
            <div className="profile_pair">
            <div className="profile_description">Write <b>3 Tags</b> to Show Your Abilities! Be Creative!</div>
            <TagsTags
                open={open}
                multiple
                freeSolo={limit}
                autoSelect
                options={taglist}
                disableClearable={false}
                onChange={(event, value) => {
                  // console.log(taglist);
                  if (value.length >= 3) {
                    value = value.slice(0, 3)
                    setLimit(false)
                    // console.log(value);
                    taglist = value
                    // console.log(taglist);
                  }
                  else {
                    setLimit(true)
                    taglist = value
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
            /></div>
            <br/><br/>
            <div className="profile_pair">
            <div className="profile_description">Write <b>3 Tags</b> to Share Interesting Facts about You!</div>
            <TagsTags
                open={open1}
                // size="small"
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
        </div>
        <br/><br/>
        <div className="button2" onClick={()=>
              profileAdd(taglist, taglist1)
              }>Submit</div>
        </div>
    )
}