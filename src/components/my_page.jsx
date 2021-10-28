import React from 'react'

const mypage = () => {

    function handleclick(){
        window.location.href = "/credit";
    }

    return (
        <div>
            <button onClick = {handleclick}>DISTRIBUTE CREDIT!</button>
        </div>
    )
}

export default mypage