import React from 'react'
import Navbar from './navbar.jsx'

const main = () => {

    function handleclick(){
        window.location.href = "/join";
    }

    return (
        <div>
            <Navbar/>
        </div>
    )
}

export default main