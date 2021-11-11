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
                <div className = "navbartest">
                    <ul>
                        <li onClick={signInWithGoogle} className="signin" href="# "><a href="# ">SIGN IN</a></li>
                        <li><a href="/startquiz">MAKE TEAM</a></li>
                        <li><a href="/">ABOUT</a></li>
                        <li><a href="/">HOME</a></li>
                        <ul style={{float: "left"}}>
                            <a href="/"><img src={LOGO} alt = "" className='logo'/></a>
                            <li><a href="/" className = "title">TUG</a></li>
                        </ul>
                    </ul>
                </div>
            )
        }
        else {
            const user_name = this.state.currentUser.displayName;
                return (
                    <ul className = "navbartest">
                        <ul style={{float: "right"}}>
                            <li className="dropdown signin"><a href="# ">
                                <i className="fas fa-user-circle fa-lg"></i>&nbsp;&nbsp;{user_name}</a>
                                <div className="dropdown-content">
                                    <a href="/mypage">My Page</a>
                                    <a onClick={() => {signOutWithGoogle(); window.location.reload();}} href="# ">Sign Out</a>
                                </div>
                            </li>
                        </ul>
                        <li><a href="/startquiz">MAKE TEAM</a></li>
                        <li><a href="/">ABOUT</a></li>
                        <li><a href="/">HOME</a></li>
                        <ul style={{float: "left"}}>
                            <a href="/"><img src={LOGO} alt = "" className='logo'/></a>
                            <li><a href="/" className = "title">TUG</a></li>
                        </ul>
                    </ul>
                )
            }
        }
    }

export default navbar