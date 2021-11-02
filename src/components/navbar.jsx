import React, {Component} from 'react'
import {auth, signInWithGoogle, signOutWithGoogle, db} from "./firebase.jsx";
import './navbar.css'
import LOGO from "../images/LOGO.PNG"

export class navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
          currentUser: null
        }
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
          this.setState({ currentUser: user });
        })
    }

    render() {
        
        if (this.state.currentUser === null) {
            return (
                <div className = "nav_bar">
                    <ul>
                        <li onClick={signInWithGoogle} className="signin" href="# "><a href="# ">SIGN IN</a></li>
                        <li><a href="/">MAKE TEAM</a></li>
                        <li><a href="/">ABOUT</a></li>
                        <li><a href="/">HOME</a></li>
                        <ul style={{float: "left"}}>
                            <img src={LOGO} alt = "" className='logo'/>
                            <li><a href="/" className = "title">TUG</a></li>
                        </ul>
                    </ul>
                </div>
            )
        }
        else {
            const user_name = this.state.currentUser.displayName;
                return (
                    <div className = "nav_bar">
                    <ul>
                    <ul style={{float: "right"}}>
                                <li className="dropdown signin"><a href="# ">
                                <i className="fas fa-user-circle fa-lg"></i>&nbsp;&nbsp;{user_name}</a>
                                    <div className="dropdown-content">
                                        <a onClick={() => {signOutWithGoogle(); window.location.reload();}} href="# ">Sign Out</a>
                                    </div>
                                </li>
                            </ul>
                        <li><a href="/">MAKE TEAM</a></li>
                        <li><a href="/">ABOUT</a></li>
                        <li><a href="/">HOME</a></li>
                        <ul style={{float: "left"}}>
                            <img src={LOGO} alt = "" className='logo'/>
                            <li><a href="/" className = "title">TUG</a></li>
                        </ul>
                    </ul>
                </div>
                )
            }
        }
    }

export default navbar