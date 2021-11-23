import React, {useState} from 'react'
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
import PropTypes from 'prop-types';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Zoom from '@mui/material/Zoom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useScrollTrigger from '@mui/material/useScrollTrigger';

const theme = createTheme({
    palette: {
      primary: {
        main: '#1b1e2e',
      },
    },
  });


function ScrollTop(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
      disableHysteresis: true,
      threshold: 100,
    });
  
    const handleClick = (event) => {
      const anchor = (event.target.ownerDocument || document).querySelector(
        '#back-to-top-anchor',
      );
  
      if (anchor) {
        anchor.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    };
  
    return (
      <Zoom in={trigger}>
        <Box
          onClick={handleClick}
          role="presentation"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          {children}
        </Box>
      </Zoom>
    );
  }
  
  ScrollTop.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
  };
  
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
                    set(ref(db, 'classes/' + classes[i].code + "/open/"), classes[i].open)
                }
                else {
                    // push(ref(db, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/totalcredit/'), 100)
                }
            }
            else {
                set(ref(db, 'classes/' + classes[i].code + "/professor/"), classes[i].professor)
                set(ref(db, 'classes/' + classes[i].code + "/name/"), classes[i].name)
                set(ref(db, 'classes/' + classes[i].code + "/open/"), classes[i].open)
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
                    push(ref(db, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/class/' + e), "no profile");
                    set(ref(db, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/email/'), auth.currentUser.email);
                  }
                else {
                    alert("Already joined")
                }
            }
            else {
                alert("Successfully joined");
                push(ref(db, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/class/' + e), "no profile")
                set(ref(db, 'users/' + auth.currentUser.uid + "/" + auth.currentUser.displayName + '/email/'), auth.currentUser.email);
              }});

        get(child(dbRef, 'classes/' + e + '/user/')).then((snapshot) => {
          if(snapshot.exists()) {
            if (!(Object.keys(snapshot.val()).includes(auth.currentUser.uid))) {
              set(ref(db, 'classes/' + e + '/user/' + auth.currentUser.uid + '/joined/'), "yes");
              set(ref(db, 'classes/' + e + '/user/' + auth.currentUser.uid + '/essen_questions/done/'), "no");
              set(ref(db, 'classes/' + e + '/user/' + auth.currentUser.uid + '/fun_questions/done/'), "no");
            }
            else {
            }
          }
          else {
            set(ref(db, 'classes/' + e + '/user/' + auth.currentUser.uid + '/joined/'), "yes");
            set(ref(db, 'classes/' + e + '/user/' + auth.currentUser.uid + '/essen_questions/done/'), "no");
            set(ref(db, 'classes/' + e + '/user/' + auth.currentUser.uid + '/fun_questions/done/'), "no");
            // alert("Successfully joined into the class!");
          }
        });
      }
  
        
export default function Join(props) {
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
            <React.Fragment>
            <div>
            <div id="back-to-top-anchor" />
            <Navbar/>
            <br/>
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
            {getclasses()}
            <table className = "table_setting"><tbody>{display()}</tbody></table>
            <ThemeProvider theme={theme}>
            <ScrollTop {...props}>
            <Fab color="primary" size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
            </Fab>
            </ScrollTop>
            </ThemeProvider>
            </div>
            </React.Fragment>
        )
    }