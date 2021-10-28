import React from "react";
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import main from "./components/main_page";
import join from "./components/join_class";
import quiz from "./components/random_quiz";
import chat from "./components/chat_room";
import mypage from "./components/my_page";
import credit from "./components/credit_system";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component = {main} />
      <Route path="/join" component = {join} />
      <Route path="/quiz" component = {quiz} />
      <Route path="/chat" component = {chat} />
      <Route path="/mypage" component = {mypage} />
      <Route path="/credit" component = {credit} />
    </Switch>
  </BrowserRouter>
);

render(<App />, document.getElementById('root'));