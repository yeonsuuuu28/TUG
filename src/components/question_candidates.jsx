
const essenQcandidates = [ // candidates of essential questions for team building
  { 
    id: 1,
    question: "Which is more comfortable to you, Korean or English?"
  },
  {
    id: 2,
    question: "Do you prefer Korean-using teammates or English-using teammates?"
  },
  {
    id: 3,
    question: "Are you a perfectionist?"
  },
  {
    id: 4,
    question: "Do you prefer python or java?"
  },
  {
    id: 5,
    question: "Are you enthusiastic or relaxed in the team?"
  },
  {
    id: 6,
    question: "Do you prefer Kaokao chatting or Zoom meeting?"
  },
  {
    id: 7,
    question: "What time do you usually work?"
  },
  {
    id: 8,
    question: "Which communication style do you prefer?"
  },
  {
    id: 9,
    question: "Do you start the project early or late?"
  },
  {
    id: 10,
    question: "What is your gender?"
  },
  {
    id: 11,
    question: "Which gender do you prefer as your teammates?"
  },
  {
    id: 12,
    question: "What grade are you in?"
  },
  {
    id: 13,
    question: "Which grade do you prefer as your teammates?"
  },
]

const essenAcandidates = [ // range description for each essenQcandidates
  { 
    id: 1,
    answers: [
      {
        score: -2,
        answer: "Korean"
      },
      {
        score: 2,
        answer: "English"
      }
    ]
  },
  {
    id: 2,
    answers: [
      {
        score: -2,
        answer: "Korean"
      },
      {
        score: 2,
        answer: "English"
      }
    ]
  },
  {
    id: 3,
    answers: [
      {
        score: -2,
        answer: "Yes"
      },
      {
        score: 2,
        answer: "No"
      }
    ]
  },
  {
    id: 4,
    answers: [
      {
        score: -2,
        answer: "python"
      },
      {
        score: 2,
        answer: "java"
      }
    ]
  },
  {
    id: 5,
    answers: [
      {
        score: -2,
        answer: "Enthusiastic"
      },
      {
        score: 2,
        answer: "Relaxed"
      }
    ]
  },
  {
    id: 6,
    answers: [
      {
        score: -2,
        answer: "Kakao chatting"
      },
      {
        score: 2,
        answer: "Zoom meeting"
      }
    ]
  },
  {
    id: 7,
    answers: [
      {
        score: -2,
        answer: "Morning"
      },
      {
        score: 2,
        answer: "Daybreak"
      }
    ]
  },
  {
    id: 8,
    answers: [
      {
        score: -2,
        answer: "Real-time"
      },
      {
        score: 2,
        answer: "Non-real-time"
      }
    ]
  },
  {
    id: 9,
    answers: [
      {
        score: -2,
        answer: "Early"
      },
      {
        score: 2,
        answer: "Late"
      }
    ]
  },
  {
    id: 10,
    answers: [
      {
        score: -2,
        answer: "Female"
      },
      {
        score: 2,
        answer: "Male"
      }
    ]
  },
  {
    id: 11,
    answers: [
      {
        score: -2,
        answer: "Female"
      },
      {
        score: 2,
        answer: "Male"
      }
    ]
  },
  {
    id: 12,
    answers: [
      {
        score: -2,
        answer: "Freshman"
      },
      {
        score: 2,
        answer: "Senior"
      }
    ]
  },
  {
    id: 13,
    answers: [
      {
        score: -2,
        answer: "Freshman"
      },
      {
        score: 2,
        answer: "Senior"
      }
    ]
  },
]

const funQcandidates = [ // candidates of fun questions
  { 
    id: 1,
    question: "Do you like pineapple pizza?"
  },
  {
    id: 2,
    question: "Do you like mint-chocolate?"
  },
  {
    id: 3,
    question: "Choose any color below!"
  },
  {
    id: 4,
    question: "Which place do you prefer to travel?"
  },
  {
    id: 5,
    question: "What do you want to eat for dinner?"
  },
  {
    id: 6,
    question: "Which fruit do you like more?"
  },
  {
    id: 7,
    question: "Which country do you want to go to travel?"
  },
  {
    id: 8,
    question: "What is your favorite weather?"
  },
  {
    id: 9,
    question: "Which one do you eat after lunch?"
  },
  {
    id: 10,
    question: "Which SNS platform do you use the most?"
  },
  {
    id: 11,
    question: "Which animal do you like the most?"
  },
  {
    id: 12,
    question: "What color are your pants now?"
  },
  {
    id: 13,
    question: "Where do you prefer to study?"
  },
  {
    id: 14,
    question: "Which is your favorite flower?"
  },
  {
    id: 15,
    question: "Choose your favorite color!"
  }
]

const funAcandidates = [ // possible answers for each funQcandidates
  { 
    id: 1,
    answers: [
      {
        score: 1,
        answer: "Absolutely"
      },
      {
        score: 2,
        answer: "Maybe"
      },
      {
        score: 3,
        answer: "Never"
      }
    ]
  },
  {
    id: 2,
    answers: [
      {
        score: 1,
        answer: "Absolutely"
      },
      {
        score: 2,
        answer: "Maybe"
      },
      {
        score: 3,
        answer: "Never"
      }
    ]
  },
  {
    id: 3,
    answers: [
      {
        score: 1,
        answer: "Yellow"
      },
      {
        score: 2,
        answer: "Green"
      },
      {
        score: 3,
        answer: "Skyblue"
      }
    ]
  },
  {
    id: 4,
    
    answers: [
      {
        score: 1,
        answer: "Mountain"
      },
      {
        score: 2,
        answer: "River"
      },
      {
        score: 3,
        answer: "Beach"
      }
    ]
  },
  {
    id: 5,
    answers: [
      {
        score: 1,
        answer: "김치찌개 Kimchi-jjigae (stew)"
      },
      {
        score: 2,
        answer: "떡볶이 Tteokbokki"
      },
      {
        score: 3,
        answer: "Vietnamese rice noodles"
      }
    ]
  },
  {
    id: 6,
    answers: [
      {
        score: 1,
        answer: "watermelon"
      },
      {
        score: 2,
        answer: "mango"
      },
      {
        score: 3,
        answer: "grapefruit"
      }
    ]
  },
  {
    id: 7,
    answers: [
      {
        score: 1,
        answer: "Australia"
      },
      {
        score: 2,
        answer: "Italy"
      },
      {
        score: 3,
        answer: "Russia"
      }
    ]
  },
  {
    id: 8,
    answers: [
      {
        score: 1,
        answer: "snowy"
      },
      {
        score: 2,
        answer: "sunny"
      },
      {
        score: 3,
        answer: "windy"
      }
    ]
  },
  {
    id: 9,
    answers: [
      {
        score: 1,
        answer: "Cookie"
      },
      {
        score: 2,
        answer: "Candy"
      },
      {
        score: 3,
        answer: "Chocolate"
      }
    ]
  },
  {
    id: 10,
    answers: [
      {
        score: 1,
        answer: "Facebook"
      },
      {
        score: 2,
        answer: "Instagram"
      },
      {
        score: 3,
        answer: "Twitter"
      }
    ]
  },
  {
    id: 11,
    answers: [
      {
        score: 1,
        answer: "Cat"
      },
      {
        score: 2,
        answer: "Dog"
      },
      {
        score: 3,
        answer: "Goose"
      }
    ]
  },
  {
    id: 12,
    answers: [
      {
        score: 1,
        answer: "Black"
      },
      {
        score: 2,
        answer: "Blue (jeans)"
      },
      {
        score: 3,
        answer: "Others"
      }
    ]
  },
  {
    id: 13,
    answers: [
      {
        score: 1,
        answer: "Home"
      },
      {
        score: 2,
        answer: "Library"
      },
      {
        score: 3,
        answer: "Cafe"
      }
    ]
  },
  {
    id: 14,
    answers: [
      {
        score: 1,
        answer: "Rose"
      },
      {
        score: 2,
        answer: "Tulip"
      },
      {
        score: 3,
        answer: "Dandelion"
      }
    ]
  },
  {
    id: 15,
    answers: [
      {
        score: 1,
        answer: "Red"
      },
      {
        score: 2,
        answer: "Orange"
      },
      {
        score: 3,
        answer: "Yellow"
      }
    ]
  }
]

export {essenQcandidates, essenAcandidates, funQcandidates, funAcandidates }