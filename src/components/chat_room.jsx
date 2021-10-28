import React from 'react'

const chat = () => {

    function handleclick(){
        window.location.href = "/my_page";
    }

    return (
        <div>
            <button onClick = {handleclick}>MYPAGE TO CHECK!</button>
        </div>
    )
}

export default chat