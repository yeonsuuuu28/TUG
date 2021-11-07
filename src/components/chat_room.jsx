import React from 'react'
import {
    useRef,
    useState
} from 'react';

import firebase from "./firebase.jsx";
import {auth, signInWithGoogle, signOutWithGoogle, db} from "./firebase.jsx";

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

// for chat ui, we are using https://chatscope.io/demo/
// https://chatscope.io/storybook/react/?path=/story/components-chatcontainer--live-controlled-example-with-grouped-messages
// might use this one too https://github.com/chatscope/use-chat, https://github.com/chatscope/use-chat-example

const Chat = () => {
    
    
    const remoteSender = "Fish";
    const localSender = "You";
    const groupIdRef = useRef(0);
    const msgIdRef = useRef(0);
    const remoteMsgCnt = useRef(0);
    const inputRef = useRef();
    const [msgInputValue, setMsgInputValue] = useState("");
    const [groups, setGroups] = useState([]);

    const handleSend = (message, sender, notCancel) => {
        console.log(sender);

        if (groups.length > 0) {
            const lastGroup = groups[groups.length - 1];

            if (lastGroup.sender === sender) {
                // Add to group
                const newMessages = [...lastGroup.messages].concat({
                    _id: `m-${++msgIdRef.current}`,
                    message,
                    sender
                });
                const newGroup = { ...lastGroup,
                    messages: newMessages
                };
                const newGroups = groups.slice(0, -1).concat(newGroup);
                setGroups(newGroups);
            } else {
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
                setGroups(groups.concat(newGroup));
            }
        } else {
            const newGroup = {
            _id: `g-${++groupIdRef.current}`,
            direction: sender === localSender ? "outgoing" : "incoming",
            messages: [{
                _id: `m-${++msgIdRef.current}`,
                message,
                sender: sender
            }]
            };
            setGroups([newGroup]);
        }

        if (!notCancel) {
            setMsgInputValue("");
            inputRef.current.focus();
        }
    };

    function handleclick(){
        window.location.href = "/mypage";
    }

    function writeToDB(messageGroup) {
        // push a child of message_group
        
        var newKey = firebase.database().ref('/rooms/cs473/').push();
        newKey.set({
            messageGroup: messageGroup
        });
    }

    function readFromDB() {
        // request to read some data
        return firebase.database().ref('/rooms/cs473/').once(
            'value',
            function(snapshot) {
                var myValue = snapshot.val();
                console.log(myValue);
            }
        );
    }

    return (
        <div>
            <script src="https://www.gstatic.com/firebasejs/3.1.0/firebase-auth.js"></script>
            <script src="https://www.gstatic.com/firebasejs/3.1.0/firebase-database.js"></script>
            <button onClick = {handleclick}>MYPAGE TO CHECK!</button>
            <button border={true} onClick={() => handleSend(`Please be my teammate! I'm telling you ${remoteMsgCnt.current++} times!`, remoteSender, true)} style={{
            marginBottom: "1em"
            }}>Add remote message</button>
            <button border={true} onClick={() => readFromDB()} style={{
            marginBottom: "1em"
            }}>Add remote message</button>
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
                    onSend={m => handleSend(m, localSender)}
                    onChange={setMsgInputValue}
                    value={msgInputValue} ref={inputRef} />
            </ChatContainer>
            </MainContainer>
        </div>
        </div>
    )
}

export default Chat