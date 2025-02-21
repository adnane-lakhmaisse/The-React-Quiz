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
  questions: [], // Liste des questions récupérées depuis le serveur
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

  // Calcul du score maximal possible
  const maxPoints = questions.reduce((per, cur) => per + cur.points, 0);
  const numQuestion = questions.length;

  // Récupération des questions depuis l'API au chargement du composant
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch(() => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />} {/* Affichage du chargement */}
        {status === "error" && <Error />} {/* Affichage d'un message d'erreur */}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestion} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestion}
              points={points}
              maxPoints={maxPoints}
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
                numQuestion={numQuestion}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
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
