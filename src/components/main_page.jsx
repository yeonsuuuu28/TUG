import React from 'react'
import Navbar from './navbar_copy.jsx'
import "./main.css"
import MAIN1 from "../images/main1.svg"
import QUIZ from "../images/quiz.svg"
import CHAT from "../images/chat.svg"
import CREDIT from "../images/credit.svg"
import {Link} from 'react-router-dom'
import useScrollTrigger from '@mui/material/useScrollTrigger';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Zoom from '@mui/material/Zoom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

import SwiperCore, {
    Navigation,Pagination,Mousewheel,Keyboard
  } from 'swiper/core';

SwiperCore.use([Navigation,Pagination,Mousewheel,Keyboard]);

const theme = createTheme({
    root: {
        zIndex: 99,
    },
    palette: {
      primary: {
        main: '#1b1e2e',
      },
    },
  });

function ScrollTop(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
      disableHysteresis: true,
      threshold: 100,
    });
  
    const handleClick = (event) => {
      const anchor = (event.target.ownerDocument || document).querySelector(
        '#back-to-top-anchor',
      );
  
      if (anchor) {
        anchor.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    };
  
    return (
      <Zoom in={trigger}>
        <Box
          onClick={handleClick}
          role="presentation"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          {children}
        </Box>
      </Zoom>
    );
  }
  
  ScrollTop.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
  };
  
  

export default function main(props) {
    return (
        <React.Fragment>
            <div id="back-to-top-anchor" />
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
            <div className="about">
                
            <Swiper pagination={{ clickable: true }} 
                    navigation={true} 
                    // mousewheel={true} 
                    keyboard={true}
                    // loop={true}
                    className="mySwiper">
            <SwiperSlide>
                <div className="service_title">OUR SERVICES</div>
                <br/>
                <div className="quizquiz">
                <img src = {QUIZ} alt=""/>
                </div>
                <div className="quizquiz_sub">
                    Fun Team-building Quiz
                </div>
                <div className="quizquiz_exp">
                    Hard to find suitable teammate?
                    <br/>
                    Answer fun quiz questions from TUG!
                    <br/>
                    We will find teammate candidates for you.
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="service_title">OUR SERVICES</div>
                <br/>
                <div className="chatchat">
                <img src = {CHAT} alt=""/>
                </div>
                <div className="chatchat_sub">
                    Anonymous Chatting
                </div>
                <div className="chatchat_exp">
                    Pressurizing to reject classmates to be a team?
                    <br/>
                    Use TUG's anonymous chat to freely converse!
                    <br/>
                    Look for your best teammates and accept/reject freely.
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="service_title">OUR SERVICES</div>
                <br/>
                <div className="creditcredit">
                <img src = {CREDIT} alt=""/>
                </div>
                <div className="creditcredit_sub">
                    Distribute Credits
                </div>
                <div className="creditcredit_exp">
                    Stressed from meeting free-riders in your team?
                    <br/>
                    You can observe distribution of credits from past teams! 
                    <br/>
                    Give credits to your teammates to help others too.
                </div>
            </SwiperSlide>
            </Swiper>
            
            </div>
        <ThemeProvider theme={theme}>
            <div className="zindex">
        <ScrollTop {...props}>
        <Fab color="primary" size="small" aria-label="scroll back to top">
        <KeyboardArrowUpIcon />
        </Fab>
        </ScrollTop>
        </div>
        </ThemeProvider>
        </React.Fragment>
    )
}