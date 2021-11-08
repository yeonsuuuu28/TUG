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
    question: "Are you good at Python?"
  },
  {
    id: 4,
    question: "Do you prefer python available teammate?"
  },
  {
    id: 5,
    question: "Are you enthusiastic or relaxed in the team?"
  },
  {
    id: 6,
    question: "Do you prefer enthusiastic or relaxed teammates?"
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
        score: 0,
        answer: "Korean"
      },
      {
        score: 5,
        answer: "English"
      }
    ]
  },
  {
    id: 2,
    answers: [
      {
        score: 0,
        answer: "Korean"
      },
      {
        score: 5,
        answer: "English"
      }
    ]
  },
  {
    id: 3,
    answers: [
      {
        score: 0,
        answer: "Yes"
      },
      {
        score: 5,
        answer: "No"
      }
    ]
  },
  {
    id: 4,
    answers: [
      {
        score: 0,
        answer: "Yes"
      },
      {
        score: 5,
        answer: "No"
      }
    ]
  },
  {
    id: 5,
    answers: [
      {
        score: 0,
        answer: "Enthusiastic"
      },
      {
        score: 5,
        answer: "Relaxed"
      }
    ]
  },
  {
    id: 6,
    answers: [
      {
        score: 0,
        answer: "Enthusiastic"
      },
      {
        score: 5,
        answer: "Relaxed"
      }
    ]
  },
  {
    id: 7,
    answers: [
      {
        score: 0,
        answer: "Morning"
      },
      {
        score: 5,
        answer: "Daybreak"
      }
    ]
  },
  {
    id: 8,
    answers: [
      {
        score: 0,
        answer: "Real-time"
      },
      {
        score: 5,
        answer: "Non-real-time"
      }
    ]
  },
  {
    id: 9,
    answers: [
      {
        score: 0,
        answer: "Early"
      },
      {
        score: 5,
        answer: "Late"
      }
    ]
  },
  {
    id: 10,
    answers: [
      {
        score: 0,
        answer: "Female"
      },
      {
        score: 5,
        answer: "Male"
      }
    ]
  },
  {
    id: 11,
    answers: [
      {
        score: 0,
        answer: "Female"
      },
      {
        score: 5,
        answer: "Male"
      }
    ]
  },
  {
    id: 12,
    answers: [
      {
        score: 0,
        answer: "Freshman"
      },
      {
        score: 5,
        answer: "Senior"
      }
    ]
  },
  {
    id: 13,
    answers: [
      {
        score: 0,
        answer: "Freshman"
      },
      {
        score: 5,
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
]

export {essenQcandidates, essenAcandidates, funQcandidates, funAcandidates }