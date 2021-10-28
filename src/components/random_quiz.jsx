import React from 'react'

const quiz = () => {

    function handleclick(){
        window.location.href = "/chat_room";
    }

    return (
        <div>
            <button onClick = {handleclick}>CHAT!</button>
        </div>
    )
}

export default quiz