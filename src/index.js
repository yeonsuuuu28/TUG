import React from "react";
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import main from "./components/main_page";
import join from "./components/join_class";
import Quiz from "./components/random_quiz";
import GroupChatInterface from "./components/chat_room";
import mypage from "./components/my_page";
import credit from "./components/credit_system";
import profile from "./components/create_profile";
import QuizInformation from "./components/quiz_information";
import ActiveTeams from "./components/activeteams";
import QuizWaiting from "./components/quizwaiting";
import WaitingJoin from "./components/waitingjoin";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component = {main} />
      <Route path="/join" component = {join} />
      <Route path="/quiz/:course/:round" component = {Quiz} />
      <Route path="/chat/:course/:round" component = {GroupChatInterface} />
      <Route path="/mypage" component = {mypage} />
      <Route path="/credit/:course" component = {credit} />
      <Route path="/profile" component = {profile} />
      <Route path="/quizinfo/:course/:round" component = {QuizInformation} />
      <Route path="/activeteams" component = {ActiveTeams} />
      <Route path="/quizwaiting/:course/:round" component = {QuizWaiting} />
      <Route path="/waitingjoin/:course" component = {WaitingJoin} />
    </Switch>
  </BrowserRouter>
);

render(<App />, document.getElementById('root'));