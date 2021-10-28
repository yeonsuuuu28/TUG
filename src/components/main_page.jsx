import React from 'react'

const main = () => {

    function handleclick(){
        window.location.href = "/join_class";
    }

    return (
        <div>
            <button onClick = {handleclick}>JOIN CLASS</button>
        </div>
    )
}

export default main