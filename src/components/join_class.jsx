import React from 'react'

const join = () => {

    function handleclick(){
        window.location.href = "/quiz";
    }

    return (
        <div>
            <button onClick = {handleclick}>Quiz</button>
        </div>
    )
}

export default join