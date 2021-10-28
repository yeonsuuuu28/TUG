import React from 'react'

const chat = () => {

    function handleclick(){
        window.location.href = "/mypage";
    }

    return (
        <div>
            <button onClick = {handleclick}>MYPAGE TO CHECK!</button>
        </div>
    )
}

export default chat