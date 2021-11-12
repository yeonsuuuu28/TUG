import React, {Component, useState, useEffect} from 'react'
import Navbar from './navbar.jsx'
import {auth, db} from "./firebase.jsx";
import { getDatabase, ref, push, get, child, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./join_class.css";
import classes from "./classes_list.jsx";
import InputAdornment from '@mui/material/InputAdornment';  
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const TextFieldSearchBar = styled(TextField)({
    '& .MuiInputBase-input': {
        fontSize: 15,
        fontFamily: "Lato",
    },
    '& .MuiInputBase-root': {
        borderRadius: 20,
        fontSize: 13,
        fontFamily: "Lato",
        paddingLeft: 5
    },
      '& label': {
        fontSize: 13,
        fontFamily: "Lato",
    },



  });

const getclasses = () => {
    const dbRef = ref(getDatabase());
    for (let i=0; i<classes.length; i++) {
        get(child(dbRef, 'classes/')).then((snapshot) => {
            if(snapshot.exists()) {
                if (!(Object.keys(snapshot.val()).includes(classes[i].code))) {
                    set(ref(db, 'classes/' + classes[i].code + "/professor/"), classes[i].professor)
                    set(ref(db, 'classes/' + classes[i].code + "/name/"), classes[i].name)
                }
                else {
                }
            }
            else {
                set(ref(db, 'classes/' + classes[i].code + "/professor/"), classes[i].professor)
                set(ref(db, 'classes/' + classes[i].code + "/name/"), classes[i].name)
            }
        });
    }
}


function classes_join(x) {
    uniqueID();
    if (auth.currentUser === null){
        alert("Sign in to join class")
    }
    else {
        dbAdd(x)
        };
    }

function uniqueID() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            return uid;
        }
        })
    }

function dbAdd(e) {
        const dbRef = ref(getDatabase());
        get(child(dbRef, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/class/')).then((snapshot) => {
            if (snapshot.exists()) {
                if (!(Object.values(snapshot.val()).includes(e))) {
                    alert("Successfully joined");
                    push(ref(db, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/class/'), e)
                }
                else {
                    alert("Already joined")
                }
            }
            else {
                alert("Successfully joined");
                push(ref(db, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/class/'), e)
            }});

        get(child(dbRef, 'classes/' + e + '/user/')).then((snapshot) => {
          if(snapshot.exists()) {
            if (!(Object.keys(snapshot.val()).includes(auth.currentUser.uid))) {
              set(ref(db, 'classes/' + e + '/user/' + auth.currentUser.uid + '/joined/'), "yes");
            }
            else {
            }
          }
          else {
            set(ref(db, 'classes/' + e + '/user/' + auth.currentUser.uid + '/joined/'), "yes");
          }
        });
      }
  

        
export default function Join() {
    const [input, setInput] = useState("");
    const [classList, setClassList] = useState(classes);

    const take_input = () => {
        let new_input = input.toLowerCase();
        let temp = [];
        for (let i=0; i<classes.length; i++) {
            if (classes[i].name.toLowerCase().includes(new_input)) {
                temp.push(classes[i])
            }
        }
        setClassList(temp);
    }
    
    const convert_key = (e) => {
        if (e.key === 'Enter') {
            take_input();
        }
    } 
    

    const display = () => {
        let table = [];
        for (var i = 0; i < classList.length; i++) {
            let j = classList[i].code;
            table.push(
                <tr className="test10" key={i}>
                    <td className="table_class" key={i+1}>
                        <div className="table_class_title">{classList[i].name}</div>
                        <div className="table_class_subtitle">{classList[i].professor}</div>
                    </td>
                    <td className="table_join_button" key={i+2}>
                        <div className="join_button" onClick = {()=>classes_join(j)} key={i+3}>JOIN</div>
                    </td>
                </tr>
            )
        }
        return table;
    }

        return (
            <div>
            <Navbar/>
            <br/>
            {getclasses()}
            <div className="join_title">Join Your Class</div>
            <br/>
            <div className="search_bar">
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <TextFieldSearchBar
                id="outlined-adornment-password"
                label="Search Classes"
                InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                    <div className="search_button">
                    <SearchIcon onClick={take_input} />
                    </div>
                    </InputAdornment>
                ),
                }}
                fullWidth
                size="small"
                margin="normal"
                onChange={(e)=>setInput(e.target.value)}
                onKeyPress={convert_key}
            />
            </Box></div>

            <table className = "table_setting"><tbody>{display()}</tbody></table>
            </div>
        )
    }