# TUG
#### Team TUG (Auejin Ham, Yeon Su Park, Cheryl Siy, Seonghye Cho)
Many KAIST students are having difficulties finding credible and suitable team members for group projects since the remote environment under pandemic does not give students communal places to get to know each other. 
To solve this problem, our team created a real-time web platform that creates a virtual space where students can discover new people, interact through an anonymized chat system and form the best possible team without feeling any social pressure. 
Our system is unique in the sense that it 
1) deploys a fun quiz session to discover the most suitable teammates through a premade algorithm, 
2) provides a chatting session where people can interact freely with the help of a moderator chatbot, 
3) promotes each users to make their choices where they accept the current team or take another chance,
4) provides information of each candidates through our distinctive credit system that is used to acknowledge their overall participation on group projects.

## Quick Start
- git clone this repository
- npm install
- npm start


## Main page & Navigation bar
- **main_page.jsx & main.css:** main page
- **navbar.jsx & navbar.css:** navigation bar for the main page
- **navbar_copy.jsx:** navigation bar for other pages

## Join Class
- **join_class.jsx & join_class.css:** component to join the class
- **modal1.jsx & modal.css:** modal to show up when pressing a button to join a class
- **classes_list.jsx:** dataset of classes
- **create_profile.jsx & create_profile.css:** component to create profile for each class
- **waitingjoin.jsx:** waiting room before joining each quiz session

## Task 1: Quiz session
- **navbar_quiz.jsx:** navigation bar to show during quiz session
- **quiz_information.jsx & quiz_information.css:** information page before each round of quiz starts
- **random_quiz.jsx & random_quiz.css:** main part of quiz session
- **question_candidates.jsx:** dataset of questions
- **kmeans.jsx:** K-means algorithm which is copied from https://medium.com/geekculture/implementing-k-means-clustering-from-scratch-in-javascript-13d71fbcb31e
- **team_building_algorithm.jsx:** algorithm part to divide students into several teams
- **quiz_waiting.jsx & quiz_waiting.css:** waiting page after quiz

## Task 2: Chat session
- **navbar_chat.jsx:** navigation bar to show during chat session
- **random_names.jsx:** dataset of random animal names
- **chat_room.jsx & chat_room.css:** main part of chat session
- **chat_user_info_vis.jsx:** credit plot at the right side of chat session
- **voting.jsx:** voting component after chat session

## Task 3: Credit distribution session
- **credit_system.jsx & credit.css:** main part of credit system
- **Dynamic Form/index.js & form.css :** Dynamic Form component used in credit system

## My Page
- **my_page.jsx:** my page tabs at the left side
- **my_class.jsx & my_class.css:** list of classes to join or make teams (YOUR CLASS tab)
- **activeteams.jsx & activeteams.css:** ACTIVE TEAM tab where users can give teammates credits
- **pastteams.jsx:** PAST TEAM tab where users can see previous credit distribution
- **profile.jsx & profile.css:** PROFILE tab with total credit and Nubjuk character

## Others
- **firebase.jsx:** configuration and initialization of firebase
- **index.js:** App component with page routes
