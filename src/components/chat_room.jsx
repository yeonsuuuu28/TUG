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

//* AnimalNames(#) - generate random names for # people without duplicates
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

    
    
    const roomInitTime = useRef(0);
    
    /*const count = useRef(10);
    const intervalId = useRef(null);

    useEffect( () => {
        intervalId.current = setInterval( () => {
            count.current -= 1;
        }, 1000);

        return () => clearInterval(intervalId.current);
    }, []);
    
    useEffect( () => {
        intervalId.current = setInterval( () => {
            setCount(10);
        }, 1000);

        return () => clearInterval(intervalId.current);
    }, [count]);*/

    // write room info with no messages when initialized 
    function updateRoomInfo(roomId) {
        const db = getDatabase();

        get(ref(db, `rooms/${roomId}/info`)).then((snapshot) => {

            if (snapshot.exists()) {
                const roomInfo = snapshot.val();

                roomInitTime.current = roomInfo['initTime'];
                console.log(snapshot.val());
            }
            
            else {
                // TODO: define animal name for each group members
                console.log("New Group Initialized!");

                const startTime = new Date().getTime();
                roomInitTime.current = startTime;
                
                set(ref(db, `rooms/${roomId}/info`), {
                    initTime: startTime,
                });
            }
        });
    }


    ///// main /////
    
    const route = `rooms/${roomId}/messages/`
    const [snapshots, loading, error] = useList(ref(db, route));
    const messages = snapshots.map(doc => doc.val())
    useEffect( () => {
        if (messages.length == 0) {
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
                <MessageList typingIndicator={<TypingIndicator content={`${remoteId} is typing`}/>}>
                    {groups.map(g => <MessageGroup key={g._id} data-id={g._id} direction={g.direction}>
                    <MessageGroup.Header>
                        { `${g.messages[0].sender}` }
                    </MessageGroup.Header>
                    <MessageGroup.Messages key={g._id} sender={g.sender}>
                        { g.messages.map(m => <Message key={m._id} data-id={m._id} model={m}/>) }
                    </MessageGroup.Messages>
                    </MessageGroup>)}
                </MessageList>
                <MessageInput 
                    placeholder="Get to know your teammates!" attachButton={false}
                    onSend={m => writeMessage(roomId, m, senderId)}
                    onChange={setMsgInputValue}
                    value={msgInputValue} ref={inputRef} />
            </ChatContainer>
            </MainContainer>
        </div>
        </div>
    )
};

// export default Chat
export default GroupChatInterface