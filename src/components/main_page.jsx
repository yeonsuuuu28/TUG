import React from 'react'
import Navbar from './navbar.jsx'
import "./main.css"
import MAIN1 from "../images/main1.svg"
import {Link} from 'react-router-dom'

const main = () => {

    function handleclick(){
        window.location.href = "/join";
    }

    return (
        <div>
            <Navbar/>
            <div className="main_first"> 
                <div className="sub_title1">TEAM FORMATION</div>
                <div className="main_title">
                    Remotely Build your
                    <br/>
                    Own Suitable Team
                    </div>
                <div className="sub_title2">
                    Remotely creating teams are hard, right?
                    <br/>
                    TUG is here to guide you to form your dreamt team.
                    <br/>
                    We provide effective ways to find your best teamates.
                </div>
                <Link to="./join">
                    <div className="button">GET STARTED</div>
                </Link>
                <img src = {MAIN1} alt="" className="image1"/>
            </div>
        </div>
    )
}

export default main