import React from 'react'
import {
    useRef,
    useState,
    useEffect
} from 'react';

import { auth, db } from "./firebase.jsx";
import { getDatabase, ref, push, get, child, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
  CustomMessage,
  MessageSeparator,
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


//* UserIdentification - identify the user and load the GetCourseList component.
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
            <Chat localSender={uid} localSenderName={username} />
          );
    }
    else {
        return (
            <div> Loading... </div>
        );
    }    
};

const Chat = ({localSender, localSenderName}) => {
    
    const [idAnonNames, setIdAnonNames] = useState({});
    const remoteSender = "Fish";
    
    const groupIdRef = useRef(0);
    const msgIdRef = useRef(0);
    const remoteMsgCnt = useRef(0);
    const inputRef = useRef();
    const [msgInputValue, setMsgInputValue] = useState("");
    const [groups, setGroups] = useState([]);

    const updatedGroups = (prevGroups, message, sender, notCancel) => {
        if (prevGroups.length > 0) {
            const lastGroup = prevGroups[prevGroups.length - 1];

            if (lastGroup.sender === sender) {
                
                console.log('append to previous group')
                // Add to group
                const newMessages = [...lastGroup.messages].concat({
                    _id: `m-${++msgIdRef.current}`,
                    message,
                    sender
                });
                const newGroup = { ...lastGroup,
                    messages: newMessages
                };
                const newGroups = prevGroups.slice(0, -1).concat(newGroup);
                
                return newGroups;
            } else {
                console.log('new group')
                // Sender different than last sender - create new group 
                const newGroup = {
                    _id: `g-${++groupIdRef.current}`,
                    direction: sender === localSender ? "outgoing" : "incoming",
                    messages: [{
                    _id: `m-${++msgIdRef.current}`,
                    message,
                    sender
                    }]
                };
                
                return prevGroups.concat(newGroup);
            }
        } else {
            console.log('new chat')
            const newGroup = {
            _id: `g-${++groupIdRef.current}`,
            direction: sender === localSender ? "outgoing" : "incoming",
            messages: [{
                _id: `m-${++msgIdRef.current}`,
                message,
                sender: sender
            }]
            };
            
            return [newGroup];
        }
    }
    
    const handleSend = (message, sender, notCancel) => {
        console.log(`${groups.length}, ${groupIdRef.current}, ${msgIdRef.current} - ${sender}: ${message}`);
        
        setGroups(updatedGroups(groups, message, sender, notCancel));
        
        if (!notCancel) {
            setMsgInputValue("");
            inputRef.current.focus();
        }
    };

    
    // Add new message to Firebase
    // TODO: Implement global messageID
    function writeMessage(roomId, messageId, message, sender) {

        // if sent by myself, sender = localSender = auth.currentUser.uid
        const db = getDatabase();
        set(ref(db, `rooms/${roomId}/messages/${msgIdRef.current}`), {
          id: `${msgIdRef.current}`,
          message: message,
          sender : sender
        });

        
        // update local interface first
        handleSend(message, sender);
    }

    
    function readRemainingMessages(roomId) {
        console.log(`reading chat logs of room[${roomId}]`)
        
        const dbRef = ref(getDatabase());
        const route = `rooms/${roomId}/messages/`
        get(child(dbRef, route)).then((snapshot) => {
            if (snapshot.exists()) {
                // for each previous messages, handleSend(message, sender, notCancel=true)
                const logs = Object.values(snapshot.val());
                const messageIds = Object.keys(logs);
                const messages = Object.values(logs);
                
                var emptyGroup = [];
                for (let i=0; i<messages.length; i++) {
                    console.log(emptyGroup.length);
                    // handleSend(messages[i]['message'], messages[i]['sender'], true);
                    emptyGroup = updatedGroups(emptyGroup, messages[i]['message'], messages[i]['sender'], true);
                }
                setGroups(emptyGroup);
            }
            else {
                console.log(`snapshot of room[${roomId}] does not exist`)
            }
        });
    }

    function handleclick(){
        window.location.href = "/mypage";
    }

    //* GetCourseList
    /// input: none
    /// output: <html> - set of courses
    function GetJoinedUserIDs(classname){

        if(classname) {
        const dbRef = ref(getDatabase());
        const route = '/classes/' + classname + '/';
        get(child(dbRef, route)).then((snapshot) => {
            if(snapshot.exists()){
                // Object.values(snapshot.val())
                const res = Object.values(snapshot.val())[0];
                const userids = Object.keys(res);
                const joineds = Object.values(res).map(x => x['joined']);
                console.log(userids);
                console.log(joineds);
            }
        });
        }

        return;
    };


    useEffect(
        ()=> {
            readRemainingMessages(0);
        }, []
    );

    return (
        <div>
            <button onClick = {handleclick}>MYPAGE TO CHECK!</button>
            <button
                border={true}
                // onClick={() => handleSend(`Please be my teammate! I'm telling you ${remoteMsgCnt.current++} times!`, remoteSender, true)}
                onClick={() => writeMessage(
                    0, 0, `Please be my teammate! I'm telling you ${remoteMsgCnt.current++} times!`, remoteSender)}
                style={{ marginBottom: "1em"}}>
                    Add remote message
            </button>
            <button
                //border={true} onClick={() => UserIdentification()}
                border={true} onClick={() => GetJoinedUserIDs('CS101')}
                style={{marginBottom: "1em"}}>
                    Read Data
            </button>
            <div style={{ position: "relative", height: "500px" }}> 
            <MainContainer>
            <ChatContainer>
                <MessageList typingIndicator={<TypingIndicator content={`${remoteSender} is typing`}/>}>
                    {groups.map(g => <MessageGroup key={g._id} data-id={g._id} direction={g.direction}>
                    <MessageGroup.Header>{`${g.messages[0].sender}`}</MessageGroup.Header>
                    <MessageGroup.Messages key={g._id} sender={g.sender}>
                        {
                        //g.messages.map(m => <CustomMessage as={Message} key={m._id} data-id={m._id} model={m} />)                        
                        g.messages.map(m => <Message key={m._id} data-id={m._id} model={m}/>)
                        }
                    </MessageGroup.Messages>
                    </MessageGroup>)}
                </MessageList>
                <MessageInput 
                    placeholder="Get to know your teammates!" attachButton={false}
                    // onSend={m => handleSend(m, localSender)} // TODO: apply dynamic room number and message id
                    onSend={m => writeMessage(0, 0, m, localSender)}
                    onChange={setMsgInputValue}
                    value={msgInputValue} ref={inputRef} />
            </ChatContainer>
            </MainContainer>
        </div>
        </div>
    )
}

// export default Chat
export default GroupChatInterface