import React, {Component} from 'react';
// import {auth, signInWithGoogle, signOutWithGoogle} from "./firebase.jsx";
import './navbar.css';
import LOGO from "../images/LOGO.PNG";
// import { Link } from "react-scroll";

export class navbar extends Component {

    render() {
            return (
                <div className = "navbartest">
                    <ul>
                        <li className="navbar_quiztime">CHATTING TIME!</li>
                        <ul style={{float: "left"}}>
                            <img src={LOGO} alt = "" className='logo'/>
                            <li><div className = "title">TUG</div></li>
                        </ul>
                    </ul>
                </div>
            )
    }}

export default navbar