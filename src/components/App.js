import { useEffect, useReducer } from "react";

// Importation des composants nécessaires
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextQuestion from "./NextQuestion";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";
import Footer from "./Footer";

// Définition de l'état initial de l'application
const initialState = {
  questions: [], // Liste des questions récupérées depuis l'API locale
  status: "loading", // Statut de l'application (loading, error, ready, active, finished)
  index: 0, // Index de la question en cours
  answer: null, // Réponse sélectionnée par l'utilisateur
  points: 0, // Score actuel
  highscore: 0, // Meilleur score enregistré
  time: null, // Temps restant pour répondre aux questions
};

const SECS_FOR_QUESTION = 30; // Durée en secondes par question

// Fonction reducer pour gérer les différentes actions de l'application
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload, // Mise à jour des questions
        status: "ready", // Changement du statut en prêt
      };
    case "dataFailed":
      return {
        ...state,
        status: "error", // Passage en état d'erreur si les données ne sont pas récupérées
      };
    case "start":
      return {
        ...state,
        status: "active", // Passage en mode actif (quiz en cours)
        time: state.questions.length * SECS_FOR_QUESTION, // Initialisation du temps total
      };
    case "newAnswer":
      const question = state.questions.at(state.index); // Récupération de la question en cours
      return {
        ...state,
        answer: action.payload, // Mise à jour de la réponse sélectionnée
        points:
          action.payload === question.correctOption
            ? state.points + question.points // Ajout des points si la réponse est correcte
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1, // Passage à la question suivante
        answer: null, // Réinitialisation de la réponse sélectionnée
      };
    case "finish":
      return {
        ...state,
        status: "finished", // Fin du quiz
        highscore:
          state.points > state.highscore ? state.points : state.highscore, // Mise à jour du meilleur score
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions, // On conserve les questions récupérées
        status: "ready",
      };
    case "tick":
      return {
        ...state,
        time: state.time - 1, // Décrémentation du temps restant
        status: state.time === 0 ? "finished" : state.status, // Fin du quiz si le temps est écoulé
      };
    default:
      throw new Error("Action inconnue"); // Gestion des actions non reconnues
  }
}

function App() {
  // Utilisation du hook useReducer pour gérer l'état global
  const [
    { questions, status, index, answer, points, highscore, time },
    dispatch,
  ] = useReducer(reducer, initialState);

  // Définir les questions locales ici
  const localQuestions = [
    {
      question: "Which is the most popular JavaScript framework?",
      options: ["Angular", "React", "Svelte", "Vue"],
      correctOption: 1,
      points: 10
    },
    {
      question: "Which company invented React?",
      options: ["Google", "Apple", "Netflix", "Facebook"],
      correctOption: 3,
      points: 10
    },
    {
      question: "What's the fundamental building block of React apps?",
      options: ["Components", "Blocks", "Elements", "Effects"],
      correctOption: 0,
      points: 10
    },
    {
      question: "What's the name of the syntax we use to describe the UI in React components?",
      options: ["FBJ", "Babel", "JSX", "ES2015"],
      correctOption: 2,
      points: 10
    },
    {
      question: "How does data flow naturally in React apps?",
      options: [
        "From parents to children",
        "From children to parents",
        "Both ways",
        "The developers decides"
      ],
      correctOption: 0,
      points: 10
    },
    {
      question: "How to pass data into a child component?",
      options: ["State", "Props", "PropTypes", "Parameters"],
      correctOption: 1,
      points: 10
    },
    {
      question: "When to use derived state?",
      options: [
        "Whenever the state should not trigger a re-render",
        "Whenever the state can be synchronized with an effect",
        "Whenever the state should be accessible to all components",
        "Whenever the state can be computed from another state variable"
      ],
      correctOption: 3,
      points: 30
    },
    {
      question: "What triggers a UI re-render in React?",
      options: [
        "Running an effect",
        "Passing props",
        "Updating state",
        "Adding event listeners to DOM elements"
      ],
      correctOption: 2,
      points: 20
    },
    {
      question: "When do we directly \"touch\" the DOM in React?",
      options: [
        "When we need to listen to an event",
        "When we need to change the UI",
        "When we need to add styles",
        "Almost never"
      ],
      correctOption: 3,
      points: 20
    },
    {
      question: "In what situation do we use a callback to update state?",
      options: [
        "When updating the state will be slow",
        "When the updated state is very data-intensive",
        "When the state update should happen faster",
        "When the new state depends on the previous state"
      ],
      correctOption: 3,
      points: 30
    },
    {
      question: "If we pass a function to useState, when will that function be called?",
      options: [
        "On each re-render",
        "Each time we update the state",
        "Only on the initial render",
        "The first time we update the state"
      ],
      correctOption: 2,
      points: 30
    },
    {
      question: "Which hook to use for an API request on the component's initial render?",
      options: ["useState", "useEffect", "useRef", "useReducer"],
      correctOption: 1,
      points: 10
    },
    {
      question: "Which variables should go into the useEffect dependency array?",
      options: [
        "Usually none",
        "All our state variables",
        "All state and props referenced in the effect",
        "All variables needed for clean up"
      ],
      correctOption: 2,
      points: 30
    },
    {
      question: "An effect will always run on the initial render.",
      options: [
        "True",
        "It depends on the dependency array",
        "False",
        "In depends on the code in the effect"
      ],
      correctOption: 0,
      points: 30
    },
    {
      question: "When will an effect run if it doesn't have a dependency array?",
      options: [
        "Only when the component mounts",
        "Only when the component unmounts",
        "The first time the component re-renders",
        "Each time the component is re-rendered"
      ],
      correctOption: 3,
      points: 20
    }
  ];

  // Utilisation du hook useEffect pour gérer l'état des questions locales
  useEffect(() => {
    // Charger les questions locales directement
    dispatch({ type: "dataReceived", payload: localQuestions });
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={questions.length} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={questions.length}
              points={points}
              maxPoints={questions.reduce((per, cur) => per + cur.points, 0)}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} time={time} />
              <NextQuestion
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestion={questions.length}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoints={questions.reduce((per, cur) => per + cur.points, 0)}
            highscore={highscore}
            dispatch={dispatch}
            questions={questions}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
