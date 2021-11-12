import React from 'react'
import Navbar from "./navbar.jsx"

const mypage = () => {

    function handleclick(){
        window.location.href = "/credit";
    }

    return (
        <div>
            <Navbar/>
            <button onClick = {handleclick}>DISTRIBUTE CREDIT!</button>
        </div>
    )
}

export default mypage