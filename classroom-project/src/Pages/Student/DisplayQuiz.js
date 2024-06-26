import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getQuiz,
  getQuizSubmission,
  submitQuiz,
} from "../../Components/Store/QuizzSlice";
import { useParams } from "react-router-dom";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { PiTimerBold } from "react-icons/pi";
import { toast } from "react-hot-toast";
import QuizSubmissions from "../Instructor/QuizSubmissions";

const DisplayQuiz = ({ quizz_id, tests, states }) => {
  const [state, setState] = useState("Menu");
  states(state);
  const [currQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [remainingTime, setRemainingTime] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);

  const dispatch = useDispatch();
  const test = useSelector((state) => state.Quizzes.question.data);
  const User = useSelector((state) => state.User.userData);
  const resloading = useSelector((state) => state.Quizzes.resLoad);
  const loading = useSelector((state) => state.Quizzes.loading);
  const result = useSelector((state) => state?.Quizzes?.result?.data);
  const { id } = useParams();

  useEffect(() => {
    dispatch(getQuiz({ id, quizz_id }));
    dispatch(getQuizSubmission({ id, quizz_id }));
  }, [dispatch, id, quizz_id, state]);

  useEffect(() => {
    setState(result?.marks ? "submitted" : "Menu");
  }, [result]);

  function answer(mark) {
    setSelectedAnswer((prevState) => ({
      ...prevState,
      [currQuestion + 1]: mark,
    }));
  }

  useEffect(() => {
    let timer;
    if (state === "Quizz"&&User.role==='Student') {
      const quizDurationInSeconds = parseInt(tests?.duration) * 60;
      setRemainingTime(quizDurationInSeconds);
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timer);
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [state, quizz_id]);

  async function submit() {
    const res = await dispatch(
      submitQuiz({ c_id: id, quizz_id, answers: selectedAnswer })
    );
    if (res?.payload?.success) {
      toast.success("Submitted successfully");
      setState("submitted");
    }
    toast.error(res.payload.message);
  }

  useEffect(() => {
    if (state === "Quizz"||(state==='submitted'&&result)) {
      setState("Menu");
      setCurrentQuestion(0)
    }
  }, [quizz_id]);

  useEffect(() => {
    if (remainingTime === 0) {
      setRemainingTime("");
      submit();
    }
  }, [remainingTime]);

  const hours = Math.floor(remainingTime / 3600);
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = remainingTime % 60;
  const marks = result?.marks < tests?.totalmarks / 2;

  return (
    <>
    <div className="Quiz">
       {User.role==='Instructor'&&
       <button style={{margin:'10px'}} className= {`btn ${!showQuiz?'btn-success':'btn-warning'}`} 
       onClick={()=>setShowQuiz(prevState=>!prevState)}>{!showQuiz?'View Questions':'View Submissions'}</button>}
     {(User.role==='Student'||showQuiz)&&(
        <div className="quiz-container">
          {state === "Menu" && (
            <div className="start-quiz d-flex flex-column align-items-center">
              <h1 className="text-center">{tests?.title}</h1>
              <p>
                <span style={{ fontSize: "15pt", fontWeight: "bold" }}>
                  {test?.length}{" "}
                </span>
                questions
              </p>
              <p>Duration: {tests?.duration} minutes</p>
              <p>Total Marks: {tests?.totalmarks}</p>
              <button onClick={() => setState("Quizz")}>Start Test</button>
            </div>
          )}
          {state === "Quizz" && (
            <div className="quiz-contents d-flex flex-column align-items-center">
             {User.role!=='Instructor'&& <div className={remainingTime<40?"end-timer":'timer'}>
                <span ><PiTimerBold style={{marginRight:'2px',marginBottom:'3px', color:'black'}}/></span> 
                <span >
                {hours?hours:'00'}:
                {minutes < 10 ? "0" + minutes : minutes}:
                {seconds < 10 ? "0" + seconds : seconds}</span>
              </div>}
              <div className=""><span>{currQuestion+1}/{test?.length}</span></div>
              <div className="quiz-q d-grid gap-3">
                <h3>{currQuestion + 1}.</h3>
                <h3>{test[currQuestion]?.Question}</h3>
              </div>
              <div className="questions ">
                <div className='q-1' >
                  <span onClick={() => answer("A")} className={`q d-flex gap-2 
                      ${selectedAnswer[currQuestion + 1] === "A"||(User.role==='Instructor'&&test[currQuestion]?.Correct==='A') ? "active" : ""
          }`}
                  >
                   <strong>A.</strong>  <p>{test[currQuestion]?.A}</p>
                  </span>
                  <span onClick={() => answer("B")}className={`q d-flex  gap-2 ${
                      selectedAnswer[currQuestion + 1] === "B"||test[currQuestion]?.Correct==='B'? "active" : ""
                    }`}
                  >
                    <strong>B.</strong> <p>{test[currQuestion]?.B}</p>
                  </span>
                  <span onClick={() => answer("C")}className={`q d-flex gap-2 ${
                      selectedAnswer[currQuestion + 1] === "C"||test[currQuestion]?.Correct==='C' ? "active" : ""
                    }`}
                  >
                   <strong>C.</strong> <p>{test[currQuestion]?.C}</p>
                  </span>
                  <span onClick={() => answer("D")} className={`q d-flex gap-2${
                      selectedAnswer[currQuestion + 1] === "D"||test[currQuestion]?.Correct==='D' ? "active" : ""
                    }`}
                  >
                    <strong>D.</strong> <p>{test[currQuestion]?.D}</p>
                  </span>
                </div>
              </div>
              <div className="navigation-buttons">
                <button
                  className="prev"
                  style={{
                    visibility: currQuestion === 0 ? "hidden" : "visible",
                  }}
                  onClick={() =>
                    currQuestion > 0 ? setCurrentQuestion(currQuestion - 1) : ""
                  }
                >
                  <FaAngleLeft />
                  Prev
                </button>
                {currQuestion !== test.length - 1 ? (
                  <button
                    className="next"
                    onClick={() =>
                      currQuestion < test.length - 1
                        ? setCurrentQuestion(currQuestion + 1)
                        : ""
                    }
                  >
                    Next
                    <FaAngleRight />
                  </button>
                ) : (
                  <div className="qsubmit d-flex justify-content-center w-100">
                   {User.role==='Student'&& <button onClick={() => submit()}>Submit</button>}
                  </div>
                )}
              </div>
            </div>
          )}
          {state === "submitted" && (
            <div
              className="result d-flex flex-column align-items-center"
              style={{ width: "100%" }}
            >
              {!loading ? (
                <>
                  <p>Your score</p>
                  <section>
                    <span style={{ color: marks ? "red" : "yellowgreen" }}>
                      {result?.marks}
                    </span>
                    <span style={{ border: "none" }}>{tests?.totalmarks}</span>
                  </section>
                </>
              ) : (
                "Please wait.."
              )}
            </div>
          )}
          
        </div>
     )}
     
    </div>
     <div>
     {User.role==='Instructor'&&!showQuiz&&(
      <QuizSubmissions quizz_id={quizz_id} tests={tests}/>
      )}
    </div>
    </>
  );
};

export default DisplayQuiz;
