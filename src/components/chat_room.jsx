import React from 'react'
import {
    useRef,
    useState,
    useEffect
} from 'react';

import { auth, db } from "./firebase.jsx";
import { getDatabase, ref, set, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { useList } from 'react-firebase-hooks/database';

import Navbar from './navbar.jsx'


// for chat ui, we are using https://chatscope.io/demo/
// https://chatscope.io/storybook/react/?path=/story/components-chatcontainer--live-controlled-example-with-grouped-messages
// might use this one too https://github.com/chatscope/use-chat, https://github.com/chatscope/use-chat-example

import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  MessageGroup,
  TypingIndicator
} from "@chatscope/chat-ui-kit-react";


const GroupChatInterface = () => {
    return (
        <div>
            <Navbar />
            <UserIdentification />
        </div>
    )
}

// generate random names for # people without duplicates
const AnimalNames = (num) => {
    const names = [
        "Tiger",
        "Wombat",
        "Opposum",
        "Dingo",
        "Stallion",
        "Jaguar",
        "Mustang",
        "Armadillo",
        "Camel",
        "Badger",
        "Addax",
        "Steer",
        "Lamb",
        "Snake",
        "Hamster",
        "Squirrel",
        "Hyena",
        "Fish",
        "Gazelle",
        "Dog",
        "Zebra",
        "Rat",
        "Mole",
        "Canary",
        "Ferret",
        "Impala",
        "Mare",
        "Hedgehog",
        "Nyancat",
        "Nupjuk"
    ]

    function randomNoRepeats(array) {
        var copy = array.slice(0);
        return function() {
          if (copy.length < 1) { copy = array.slice(0); }
          var index = Math.floor(Math.random() * copy.length);
          var item = copy[index];
          copy.splice(index, 1);
          return item;
        };
    }

    var uniqueNames = [];
    const newName = randomNoRepeats(names);
    for (var i=0; i<num; i++) {
        uniqueNames.push(newName());
    }

    return uniqueNames;
}

// identify the user and load RealChat component.
function UserIdentification(){
    const [uid, setUid] = useState('');
    const [username, setUserName] = useState('');
  
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(String(auth.currentUser.uid));
                setUserName(String(auth.currentUser.displayName));
                console.log("Hello", auth.currentUser.uid, auth.currentUser.displayName);
            }
        });
    }, [])
    
    if (uid && username) {
        return (
            <RealChat roomId={0} senderId={uid}/>
          );
    }
    else {
        return (
            <div> Loading ... </div>
        );
    }    
};

const RealChat = ({roomId, senderId}) => {
    
    const remoteId = 'Moderator';
    const remoteMsgCnt = useRef(0);
    
    const inputRef = useRef();
    const [msgInputValue, setMsgInputValue] = useState("");
    const [groups, setGroups] = useState([]);

    // read append one chat message message and return new groups[] 
    const updatedGroups = (prevGroups, messageId, message, sender, notCancel) => {

        if (prevGroups.length > 0) {
            const lastGroup = prevGroups[prevGroups.length - 1];

            if (lastGroup.sender === sender) {
                // Add to group
                const newMessages = [...lastGroup.messages].concat({
                    _id: `${messageId}`,
                    message,
                    sender: sender
                });
                const newGroup = { ...lastGroup,
                    messages: newMessages
                };
                const newGroups = prevGroups.slice(0, -1).concat(newGroup);
                
                return newGroups;
            }
            
            else {
                // Sender different than last sender - create new group 
                const newGroup = {
                    _id: `${messageId}`,
                    direction: sender === senderId ? "outgoing" : "incoming",
                    messages: [{
                        _id: `${messageId}`,
                        message,
                        sender: sender
                    }],
                    sender: sender
                };
                
                return prevGroups.concat(newGroup);
            }
        }
        
        else {
            const newGroup = {
                _id: `${messageId}`,
                direction: sender === senderId ? "outgoing" : "incoming",
                messages: [{
                    _id: `${messageId}`,
                    message,
                    sender: sender
                }],
                sender: sender
            };
            
            return [newGroup];
        }
    }

    // append one chat message and apply it to render
    const handleSend = (messageId, message, sender, notCancel) => {
        setGroups(updatedGroups(groups, messageId, message, sender, notCancel));
        
        if (!notCancel) {
            setMsgInputValue("");
            inputRef.current.focus();
        }
    };

    // write one chat message to Firebase and render
    function writeMessage(roomId, message, sender) {
        
        const messageId = String(new Date().getTime())

        // if sent by myself, sender = localSender = auth.currentUser.uid
        const db = getDatabase();
        set(ref(db, `rooms/${roomId}/messages/${messageId}`), {
          id: `${messageId}`,
          message: message,
          sender : sender
        });
        
        // render webpage
        handleSend(messageId, message, sender);
    }

    
    const secToRemind = [10, 20, 60, 120];
    const maxChatSec = 120; // time to chat for each group (unit:s)
    //const chatFinished = useRef(true);
    const secLeft = useRef(0); // time left to chat with group members (unit:s)
    const timerId = useRef(null);
    const [timerSec, setTimerSec] = useState(0);
    const [timerMin, setTimerMin] = useState(0);
    
    useEffect( () => {
        timerId.current = setInterval( () => {
            setTimerMin(parseInt(secLeft.current / 60));
            setTimerSec(parseInt(secLeft.current % 60));
            secLeft.current -= 1;
        }, 1000);
        
        return () => clearInterval(timerId.current);
    }, []);
    
    useEffect( () => {
        if (secLeft.current < 0){
            console.log("타임 아웃");
            set(ref(db, `rooms/${roomId}/info/chatFinished`), true);
            clearInterval(timerId.current);
        }
    }, [timerSec]);
    
    // time when room first got created (unit:ms)
    const roomInitTime = useRef(0);

    // write room info with no messages when initialized 
    function updateRoomInfo(roomId) {
        const db = getDatabase();

        get(ref(db, `rooms/${roomId}/info`)).then((snapshot) => {

            if (snapshot.exists()) {
                const roomInfo = snapshot.val();
                console.log(snapshot.val());

                // (unit:s) roomInitTime/1000 <= nowTime/1000 <= roomInitTime/1000 + maxChatSec
                roomInitTime.current = roomInfo['initTime'];
                
                const nowTime = new Date().getTime();
                const timeLeft = (roomInfo['initTime'] / 1000) + maxChatSec - (nowTime / 1000);
                secLeft.current = timeLeft;
                setTimerMin(parseInt(secLeft.current / 60));
                setTimerSec(parseInt(secLeft.current % 60));
                
                // must check again even if not finished on the server
                if (roomInfo['chatFinished'] === false && timeLeft < 0) {
                    set(ref(db, `rooms/${roomId}/info/chatFinished`), true);
                }
            }
            
            else {
                // TODO: define animal name for each group members
                console.log("New Group Initialized!");

                const nowTime = new Date().getTime();
                roomInitTime.current = nowTime;
                secLeft.current = maxChatSec;
                setTimerMin(parseInt(secLeft.current / 60));
                setTimerSec(parseInt(secLeft.current % 60));
                
                set(ref(db, `rooms/${roomId}/info`), {
                    initTime: nowTime,
                    chatFinished: false,
                });
            }
        });
    }

    ///// main /////
    
    const route = `rooms/${roomId}/messages/`
    const [snapshots, loading, error] = useList(ref(db, route));
    const messages = snapshots.map(doc => doc.val())
    useEffect( () => {
        if (messages.length === 0) {
            // TODO: start timer for this group
            updateRoomInfo(roomId);
        }
        var emptyGroup = [];
        for (let i=0; i<messages.length; i++) {
            emptyGroup = updatedGroups(emptyGroup, messages[i]['id'], messages[i]['message'], messages[i]['sender']);
        }
        setGroups(emptyGroup);
        }, [snapshots]
    )

    return (
        <div>
            <button
                onClick={() => writeMessage( roomId, `${senderId} clicked me ${remoteMsgCnt.current++} times!`, remoteId )}
                style={{ marginBottom: "1em"}}>
                    Let Moderator Speak
            </button>
            <div style={{ position: "relative", height: "500px" }}> 
            <MainContainer>
            <ChatContainer>
                <MessageList typingIndicator={(timerSec>0 || timerMin>0) && <TypingIndicator content={
                    (timerMin>0 ? `${timerMin} minute${timerMin<2 ? "" : "s"} ` : "") + `${timerSec} second${timerSec<2 ? "" : "s"} left!`}/>}>
                    {groups.map(g => <MessageGroup key={g._id} data-id={g._id} direction={g.direction}>
                    <MessageGroup.Header>
                        { `${g.messages[0].sender}` }
                    </MessageGroup.Header>
                    <MessageGroup.Messages key={g._id} sender={g.sender}>
                        { g.messages.map(m => <Message key={m._id} data-id={m._id} model={m}/>) }
                    </MessageGroup.Messages>
                    </MessageGroup>)}
                </MessageList>
                {(timerSec>0 || timerMin>0) && <MessageInput 
                    placeholder={"Get to know your teammates!"}
                    attachButton={false}
                    onSend={m => writeMessage(roomId, m, senderId)}
                    onChange={setMsgInputValue}
                    value={msgInputValue} ref={inputRef} />}
                {(timerSec<=0 && timerMin<=0) && <MessageInput 
                    disabled
                    placeholder={"Finished! Please wait for votes..."}
                    attachButton={false}
                    onSend={m => writeMessage(roomId, m, senderId)}
                    onChange={setMsgInputValue}
                    ref={inputRef} />}
                
            </ChatContainer>
            </MainContainer>
        </div>
        </div>
    )
};

// export default Chat
export default GroupChatInterface