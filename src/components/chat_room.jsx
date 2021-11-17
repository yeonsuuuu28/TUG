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
import InfoVis from './chat_user_info_vis.jsx'
import Voting from './voting.jsx'
import RandomNames from './random_names.jsx'

import './chat_room.css'


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

const GroupChatInterface = (props) => {
  ////////////////////// added by Seonghye /////////////////////////
  const course = props.match.params.course; 
  const round = props.match.params.round;
  ////////////////////// added by Seonghye /////////////////////////

    return (
        <div>
            <Navbar />
            <div class="row">
                <UserIdentification classId={course} chatRound={round} />
            </div>
        </div>
    )
}

// identify the user and load RealChat component.
function UserIdentification({classId, chatRound}){
    const [uid, setUid] = useState('');
    const [username, setUserName] = useState('');
    
  
    useEffect(() => {
        // get uid and username from auth
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
            <RoomForSender classId={classId} senderId={uid} senderName={username} chatRound={chatRound}/>
        );
    }
    else {
        return (
            <div> Loading Auth... </div>
        );
    }    
};

function RoomForSender({classId, senderId, senderName, chatRound}){
    // room of classId that contains senderId
    const [roomId, setRoomId] = useState(-1);

    // userIds of group peers in the same room. used to generate random names
    const [anonNames, setAnonNames] = useState([]);
    
    const namePairs = (uids) => {
        
        const anons = RandomNames(uids.length)
        let outs = {}

        for (let i=0; i<uids.length; i++) {
            outs[uids[i]] = anons[i];
        }

        return outs;
    }

    useEffect(() => {
        const db = getDatabase();

        // classes/CS473/rooms/0/users/{idx:userId}
        get(ref(db, `classes/${classId}/rooms`)).then((snapshotRoom) => {
            if (snapshotRoom.exists()) {
                // check every rooms in classId
                snapshotRoom.forEach((snapshotChild) => {
                    const roomIdTemp = snapshotChild.key;
                    const snapshotUsers = snapshotChild.child("users");
                    if (snapshotUsers.val().includes(senderId)) {
                        setRoomId(roomIdTemp);
                        setAnonNames(namePairs(snapshotUsers.val()));
                    }
                })
            }
        });
        
    }, [])
    
    if (roomId > -1) {
        return (
            <RealChat classId={classId} roomId={roomId} senderId={senderId} senderName={senderName} namePairs={anonNames} chatRound={chatRound}/>
        );
    }
    else {
        return (
            <div> Loading Room... </div>
        );
    }
}

// return list of (str) userId for roomId
function getUserIdsInRoom(classId, roomId) {
    const db = getDatabase();

    // classes/CS473/rooms/0/users/{idx:userId}
    get(ref(db, `classes/${classId}/rooms/${roomId}/users`)).then((snapshot) => {
        if (snapshot.exists()) {
            const userIds = snapshot.val();
            console.log(userIds)
            return userIds // 이거 왜 undefined?
        }
        else {
            // no room info found
            alert(`No Room ${roomId} in ${classId}`);
            return []
        }
    });
}

const RealChat = ({ classId, roomId, senderId, senderName, namePairs, chatRound}) => {
    // TODO: use classId, chatRound. luclily, no local variables have same name with these

    ///// chat interface /////

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

    ///// real-time chat update /////
    
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

    //// real-time plot update /////
    const [plotUserId, setPlotUserId] = useState('');
    const [plotData, setPlotData] = useState([]);
    
    useEffect(() => {
        if (plotUserId.length > 0) {
            const db = getDatabase();
            let outData = [];
            
            // users/id/name/pastteams/CS101/??/Auejin:"10" <- 다른 사람한테 받은 점수
            // users/id/name/pastteams/CS101/??/credits:"3" <- 얘가 모든 클래스 평균
            get(ref(db, `users/${plotUserId}`)).then((snapshot) => {
                if (snapshot.exists()) {

                    // iterate once sice each id has one name
                    snapshot.forEach((snapshotChild) => {
                        
                        // iterate for each class
                        snapshotChild.child("pastteams").forEach((snapshotClass) => {
                            const res = Object.values(snapshotClass.val());
                            
                            let meanCredit = -1;
                            let creditSum = 0;
                            let peers = 0;
                            
                            for (const r of res) {
                                console.log('credit r', r)
                                if (Object.keys(r).includes('credits')) {
                                    meanCredit = parseInt(r['credits'])
                                }
                                else {
                                    creditSum += parseInt(r['credit'])
                                    peers += 1;
                                }
                            }
                            
                            const myCredit = Math.round(100 * creditSum / peers) / 100;
                            
                            outData.push({
                                'class': snapshotClass.key,
                                'class average': meanCredit,
                                'peers': myCredit,
                            })
                        })
                    })

                    console.log(`plot data of ${plotUserId} is`, outData)
                    setPlotData(outData);
                }
            });
        }
    }, [plotUserId])


    ///// moderator /////
    
    const secToRemind = [10, 20, 60, 120];
    const maxChatSec = 120; // time to chat for each group (unit:s)
    //const chatFinished = useRef(true);
    const secLeft = useRef(0); // time left to chat with group members (unit:s)
    const timerId = useRef(null);
    const [timerSec, setTimerSec] = useState(parseInt(maxChatSec / 60));
    const [timerMin, setTimerMin] = useState(parseInt(maxChatSec % 60));
    
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
        
    
    
    return (
        <div style={{ height: "100%"}}>
            <div class="column">
                <button
                    onClick={() => getUserIdsInRoom("CS473", 0)}
                    style={{ marginBottom: "1em"}}>
                        getUserIdsInRoom(CS473, 0)
                </button>
                <button
                    onClick={() => setPlotUserId("r0UNsRPIzGVO99ovbeiuilpTxIp2")}
                    style={{ marginBottom: "1em"}}>
                        show plot of cheryl
                </button>
                <button
                    onClick={() => writeMessage( roomId, `${senderId} clicked me ${remoteMsgCnt.current++} times!`, remoteId )}
                    style={{ marginBottom: "1em"}}>
                        Let Moderator Speak
                </button>
                <div style={{ position: "relative", height: "530px" }}> 
                <MainContainer>
                <ChatContainer>
                    <MessageList typingIndicator={(timerSec>0 || timerMin>0) && <TypingIndicator content={
                        (timerMin>0 ? `${timerMin} minute${timerMin<2 ? "" : "s"} ` : "") + `${timerSec} second${timerSec<2 ? "" : "s"} left!`}/>}>
                        {groups.map(g => <MessageGroup key={g._id} data-id={g._id} direction={g.direction}>
                        <MessageGroup.Header>
                        { (g.sender === remoteId) ? remoteId : namePairs[g.sender] }
                        </MessageGroup.Header>
                        <MessageGroup.Messages key={g._id} sender={g.sender}>
                            { g.messages.map(m => (
                                <Message
                                    key={m._id} data-id={m._id} model={m}
                                    onClick={()=>{setPlotUserId(g.messages[0].sender)}}/>
                            )) }
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
            <div class="column" style={{height: 200}} >
                {(timerSec<=0 && timerMin<=0) && <Voting course={classId} round={chatRound}/> }
                {(plotUserId.length<=0 || plotUserId === remoteId) && <h1>Click one of chat bubbles.</h1>}
                {(plotUserId.length<=0 || plotUserId === remoteId) && <h1>See credit history of the one who wrote it.</h1>}
                {(plotUserId.length>0 && plotUserId !== remoteId) && <h1>Credits of { (plotUserId === remoteId) ? remoteId : namePairs[plotUserId] }</h1>}
                {plotUserId !== remoteId && plotData.length > 0 && <InfoVis data={plotData}/>}
                {plotUserId !== remoteId && plotData.length <= 0 && <h2>no history found</h2>}
            </div>
        </div>
    )
};



// export default Chat
export default GroupChatInterface