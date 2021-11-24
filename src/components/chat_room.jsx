import React from 'react'
import {
    useRef,
    useState,
    useEffect
} from 'react';

// eslint-disable-next-line
import { auth, db } from "./firebase.jsx";

import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useList } from 'react-firebase-hooks/database';

import Navbar from './navbar.jsx'
import CreditPlot from './chat_user_info_vis.jsx'
import Voting from './voting.jsx'
import RandomNames from './random_names.jsx'
import './chat_room.css'


// for chat ui, we are using https://chatscope.io/demo/
// https://chatscope.io/storybook/react/?path=/story/components-chatcontainer--live-controlled-example-with-grouped-messages
// might use this one too https://github.com/chatscope/use-chat, https://github.com/chatscope/use-chat-example

// eslint-disable-next-line
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
            <div className="row">
                <UserIdentification classId={String(course)} chatRound={parseInt(round)} />
            </div>
        </div>
    )
}

// identify the user and load RealChat component.
function UserIdentification({classId, chatRound}){
    const auth = getAuth();
    const [uid, setUid] = useState('');
    const [username, setUserName] = useState('');
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUid(String(auth.currentUser.uid));
            setUserName(String(auth.currentUser.displayName));
            console.log("Hello", auth.currentUser.uid, auth.currentUser.displayName);
        }
    });

    if (uid.length * username.length > 0) {
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
    // error when reading room distribution {0: loading, 1: no classId in room distribution, 2: no room distribution}
    const [errorCode, setErrorCode] = useState(0);

    // room of classId that contains senderId {-1: loading or error, otherwise: found your room}
    const [roomId, setRoomId] = useState(-1);

    // userIds of group peers in the same room. used to generate random names
    const [anonNames, setAnonNames] = useState([]);
    
    // returns {uid: anonName} dictionary
    const namePairs = (uids) => {
        const anons = RandomNames(uids.length)
        let outs = {}
        for (let i=0; i<uids.length; i++) {
            outs[uids[i]] = anons[i];
        }
        return outs;
    }

    
    // reset finished chat room to prevent reusing it
    const resetRoomIfDone = (roomId) => {
        get(ref(db, `rooms/${classId}/${roomId}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const finished = snapshot.child('info/chatFinished').val();
                if (finished) {
                    set(ref(db, `rooms/${classId}/${roomId}`), null);
                }
            }
        })
    }

    // read global {uid: anonName} dictionary of this room, create one if not found
    const updateAnonsIfNone = (roomId, userList) => {
        get(ref(db, `rooms/${classId}/${roomId}/anons`)).then((snapshot) => {
            if (snapshot.exists()) {
                setAnonNames(snapshot.val());
            }
            else {
                const pairs = namePairs(userList);
                set(ref(db, `rooms/${classId}/${roomId}/anons`), pairs);
                setAnonNames(pairs);
            }
        })
    }

    console.log(`finding room for sender=${senderId} in ${classId}`)

    // run this once when creating the room
    useEffect(() => {

        // read room info for sender: classes/CS473/rooms/0/users/{idx:userId}
        get(ref(db, `classes/${classId}/rooms`)).then((snapshotRoom) => {
            if (snapshotRoom.exists()) {
                // senderId is not assigned to any rooms
                setErrorCode(1);

                // check every rooms in classId
                snapshotRoom.forEach((snapshotChild) => {
                    const roomIdTemp = snapshotChild.key;
                    const snapshotUsers = snapshotChild.child("users");
                    if (snapshotUsers.val().includes(senderId)) {
                        setErrorCode(0);
                        resetRoomIfDone(roomIdTemp);
                        setRoomId(roomIdTemp);
                        updateAnonsIfNone(roomIdTemp, snapshotUsers.val());
                    }
                })
            }
            else {
                // room distribution is not created
                setErrorCode(2);
            }
        });
    // eslint-disable-next-line
    }, [])
    
    if (roomId > -1) {
        return (
            <RealChat classId={classId} roomId={roomId} senderId={senderId} senderName={senderName} namePairs={anonNames} chatRound={chatRound}/>
        );
    }
    else {
        if (errorCode === 0) {
            return (
                <div> Loading Room ... </div>
            );
        }
        else if (errorCode === 1) {
            return (
                <div>
                    <h1>Error</h1>
                    <p>Chat rooms are not distributed for {classId}.</p>
                </div>
            );
        }
        else if (errorCode === 2) {
            return (
                <div>
                    <h1>Error</h1>
                    <p>You are not assigned to any room in {classId}.</p>
                </div>
            );
        }
    }
}

// return list of (str) userId for roomId
/*function getUserIdsInRoom(classId, roomId) {
    
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
}*/

const ProfileTags = ({skills, hobbies}) => {
    if (skills.length * hobbies.length > 0) {
        return (
            <div>
                {<h2>Skill-Sets</h2>}
                {skills.map(tag => `#${tag}\t`)}
                {<h2>Interesting Facts</h2>}
                {hobbies.map(tag => `#${tag}\t`)}
            </div>
        )
    }
    else {
        return (
            <div>Illegal Request of Profiles</div>
        )
    }
}

const RealChat = ({ classId, roomId, senderId, senderName, namePairs, chatRound}) => {
    // TODO: use chatRound. luclily, no local variables have same name with these

    ///// chat interface /////

    const remoteId = 'Moderator';
    //const remoteMsgCnt = useRef(0);
    
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
        set(ref(db, `rooms/${classId}/${roomId}/messages/${messageId}`), {
          id: `${messageId}`,
          message: message,
          sender : sender
        });
        
        // render webpage
        handleSend(messageId, message, sender);
    }

    
    
    
    // time when room first got created (unit:ms)
    //const roomInitTime = useRef(0);
    const [roomInitTime, setRoomInitTime] = useState(0);

    // write room info with no messages when initialized 
    function updateRoomInfo(roomId) {
        get(ref(db, `rooms/${classId}/${roomId}/info`)).then((snapshot) => {

            if (snapshot.exists() && snapshot.val()['chatFinished'] === false) {
                const roomInfo = snapshot.val();
                console.log(snapshot.val());

                // (unit:s) roomInitTime/1000 <= nowTime/1000 <= roomInitTime/1000 + maxChatSec
                //roomInitTime.current = roomInfo['initTime'];
                setRoomInitTime(roomInfo['initTime'])
                
                const nowTime = new Date().getTime();
                const timeLeft = (roomInfo['initTime'] / 1000) + maxChatSec - (nowTime / 1000);
                secLeft.current = timeLeft;
                setTimerMin(parseInt(secLeft.current / 60));
                setTimerSec(parseInt(secLeft.current % 60));
                
                // must check again even if not finished on the server
                if (roomInfo['chatFinished'] === false && timeLeft < 0) {
                    set(ref(db, `rooms/${classId}/${roomId}/info/chatFinished`), true);
                }
            }
            
            else {
                // TODO: define animal name for each group members
                console.log("New Group Initialized!");

                const nowTime = new Date().getTime();
                // roomInitTime.current = nowTime;
                setRoomInitTime(nowTime)
                secLeft.current = maxChatSec;
                setTimerMin(parseInt(secLeft.current / 60));
                setTimerSec(parseInt(secLeft.current % 60));
                
                set(ref(db, `rooms/${classId}/${roomId}/info`), {
                    initTime: nowTime,
                    chatFinished: false,
                });
            }
        });
    }

    ///// real-time chat update /////
    
    const route = `rooms/${classId}/${roomId}/messages/`
    // eslint-disable-next-line
    const [snapshots, loading, error] = useList(ref(db, route));
    const messages = snapshots.map(doc => doc.val())
    useEffect( () => {
        if (messages.length === 0) {
            // timer starts for this group
            updateRoomInfo(roomId);
        }
        var emptyGroup = [];
        for (let i=0; i<messages.length; i++) {
            emptyGroup = updatedGroups(emptyGroup, messages[i]['id'], messages[i]['message'], messages[i]['sender']);
        }
        setGroups(emptyGroup);
        // eslint-disable-next-line
    }, [snapshots, roomInitTime])

    //// real-time plot update /////
    const [plotUserId, setPlotUserId] = useState('');
    const [plotData, setPlotData] = useState([]);
    
    // update for each click
    useEffect(() => {
        if (plotUserId.length > 0 && plotUserId !== remoteId) {

            let outData = [];

            // users/id/name/vis/classid/{idx: {ave_credit:#, name:#}} // 0<=idx<len(team)
            // ave_credit := received scores from other teammates
            // iterate all idx; given=self.ave_credit & received=mean(others.ave_credit)
            get(ref(db, `users/${plotUserId}`)).then((snapshot) => {
                if (snapshot.exists()) {

                    // iterate once sice each id has one name
                    snapshot.forEach((snapshotChild) => {
                        const plotUserName = snapshotChild.key
                        
                        // iterate for each pastclass
                        snapshotChild.child("vis").forEach((snapshotClass) => {
                            // res array of dict{ave_credit:#, name:#}
                            const res = Object.values(snapshotClass.val());
                            console.log(snapshotClass.key, res)
                            
                            let received = -1;
                            let creditSum = 0;
                            let peers = 0;
                            
                            for (const r of res) {
                                if (r['name'] === plotUserName) {
                                    received = parseFloat(r['ave_credit'])
                                    received = Math.round(100 * received) / 100;
                                }
                                else {
                                    creditSum += parseFloat(r['ave_credit'])
                                    peers += 1;
                                }
                            }
                            
                            const given = Math.round(100 * creditSum / peers) / 100;
                            
                            outData.push({
                                'class': snapshotClass.key,
                                'received': received,
                                'given': given,
                            })
                        })
                    })

                    console.log(`plot data of ${plotUserId} is`, outData)
                    setPlotData(outData);
                }
            });
            
        }
    }, [plotUserId])


    //// real-time profile update /////
    const [skills, setSkills] = useState([]);
    const [hobbies, setHobbies] = useState([]);

    // update for each click
    useEffect(()=>{
        if (plotUserId.length > 0 && plotUserId !== remoteId) {
            
            // read tag array: users/${userId}/${userName}/class/${classId}/profile1
            get(ref(db, `users/${plotUserId}`)).then((snapshot) => {
                snapshot.forEach((s) => {
                    setSkills(s.child(`class/${classId}/profile1`).val())
                    setHobbies(s.child(`class/${classId}/profile2`).val())

                    console.log(`skills of ${plotUserId} are`, skills)
                    console.log(`hobbies of ${plotUserId} are`,hobbies)
                })
            })
        }
    // eslint-disable-next-line
    }, [plotUserId])


    ///// chat timer /////    
    
    const maxChatSec = 300; // time to chat for each group (unit:s)
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
            console.log("CHAT SESSION FINISHED!");
            set(ref(db, `rooms/${classId}/${roomId}/info/chatFinished`), true);
            clearInterval(timerId.current);
        }
    // eslint-disable-next-line
    }, [timerSec]);


    ///// global chat moderator /////

    // sec left to send messages to all room members (ascending order)
    const whenToRemind = [299, 180, 60, 10].sort((a,b) => b-a);
    const reminders = [
        "Chat with your potential group members. Click each chat bubble to see profiles of its author.",
        "You have three minutes before voting!",
        "One minute left! Share your last comments to people.",
        "Ten seconds left! Get ready to vote!",
    ]
    const checkReminderFrom = useRef(0);
    const newCheckReminderFrom = useRef(-1);

    useEffect( () => {
        if (roomInitTime && roomInitTime > 0) {
            let breakLoop = false;
            newCheckReminderFrom.current = -1;

            for (let i=checkReminderFrom.current; i<whenToRemind.length && !breakLoop; i++) {
                
                let sec = whenToRemind[i];
                let mid = 1000 * (maxChatSec - sec) + roomInitTime;
                let msg = reminders[i];
                console.log(i, sec, mid, msg);

                if (secLeft.current >= sec) {
                    // not ready to send message
                    breakLoop = true;
                }
                else {
                    

                    get(ref(db, `rooms/${classId}/${roomId}/messages`)).then((snapshot) => {
                        if (snapshot.exists()) {                            
                            const msgs = Object.values(snapshot.val());
                            const res = msgs.filter((x) => x.message === reminders[i])
                            if (res.length === 0) {
                                get(ref(db, `rooms/${classId}/${roomId}/messages/${mid}`)).then((snapshot) => {
                                    if (!snapshot.exists()) {
                                        set(ref(db, `rooms/${classId}/${roomId}/messages/${mid}`), {
                                            id: `${mid}`,
                                            message: msg,
                                            sender : remoteId
                                        });
                                        
                                        newCheckReminderFrom.current = i;
                                    }
                                    
                                })
                            }
                        }
                        else {
                            set(ref(db, `rooms/${classId}/${roomId}/messages/${mid}`), {
                                id: `${mid}`,
                                message: msg,
                                sender : remoteId
                            });
                            
                            newCheckReminderFrom.current = i;
                        }
                    })
                }
            }
            
            if (newCheckReminderFrom > 0) {
                checkReminderFrom.current = newCheckReminderFrom;
            }
            
        }

    // eslint-disable-next-line
    }, [timerSec]);

    
    
    
    return (
        <div style={{ height: "100%"}}>
            <div className="column">
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
            
            <div className="column" style={{height: 200}} >
                {(timerSec<=0 && timerMin<=0) &&
                    <Voting course={classId} round={chatRound}/>
                }
                {(timerSec>0 || timerMin>0) && 
                    ((plotUserId.length<=0 || plotUserId === remoteId) && 
                        <h1>Click one of chat bubbles to see profile.</h1>)
                }
                {(timerSec>0 || timerMin>0) && 
                    (plotUserId.length>0 && plotUserId !== remoteId) && 
                    <div>
                        <h1>{namePairs[plotUserId]}</h1> 
                        <ProfileTags skills={skills} hobbies={hobbies} />
                    </div>
                }
                {(timerSec>0 || timerMin>0) && 
                    (plotUserId.length>0 && plotUserId !== remoteId) && 
                    (<h2>Credit History</h2>)
                }
                {(timerSec>0 || timerMin>0) && 
                    (plotUserId.length>0 && plotUserId !== remoteId) && 
                    (( plotData.length > 0 && <CreditPlot data={plotData}/>) || ( plotData.length <= 0 && <p>no credit history found.<br/>please welcome the newcomer!</p>))
                }
            </div>
        </div>
    )
};


export default GroupChatInterface