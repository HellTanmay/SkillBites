import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {  getAllSubmissions } from '../../Components/Store/QuizzSlice';
import DisplayQuiz from '../Student/DisplayQuiz';

const QuizSubmissions = ({quizz_id,tests}) => {
    const allLoading = useSelector((state) => state.Quizzes.allLoading);
    const allResult = useSelector((state) => state?.Quizzes?.AllResult?.data);
    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllSubmissions({ id, quizz_id }));
      }, [id,quizz_id]);

    function format(formatted) {
        const date = new Date(formatted);
        const dateType = date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
    
        const timeType = date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return { date: dateType, time: timeType };
      }

  return (
    <div>
        <div className="quiz-submissions">
          <h1 className='text-center'>Submitted Tests</h1>
          <table className="table table-light table-hover table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th scope="col">Sl_No</th>
                <th className='text-center' scope="col">Students</th>
                <th scope="col">Student Email</th>
                <th scope="col">Marks</th>
                <th scope="col">Submitted on</th>
              </tr>
            </thead>
            {!allLoading?(
              allResult?.length !== 0 ? (
                <tbody>
                  {allResult&&allResult?.map((user, index) => (
                    <tr key={user?.student?._id}>
                      <th scope="row">{index + 1}</th>
                      <td>
                        <img src={user.student.photo}loading="lazy" width="40px"height="40px"className="profile-pic" alt="profile"
                        />
                        {user?.student?.username}
                      </td>
                      <td>{user?.student.email}</td>
                      <td>
                        <span
                          className={
                            user?.marks > tests?.totalmarks / 2
                              ? "badge bg-success"
                              : "badge bg-danger"
                          }
                        >
                          {user?.marks}/{tests?.totalmarks}
                        </span>
                      </td>
                      <td style={{width:'150px'}}>
                        {format(user.submittedAt).date +
                          " at " +
                          format(user.submittedAt).time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colspan="5" className="text-center">
                      No Submissions yet
                    </td>
                  </tr>
                </tbody>
              )
          ):(
            <tbody>
               {Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td className=""><div className="table-skeleton"></div></td>
                    <td className=""><div className="table-skeleton"></div></td>
                    <td className=""><div className="table-skeleton"></div></td>
                    <td className=""><div className="table-skeleton"></div></td>
                    <td className=""><div className="table-skeleton"></div></td>
                  </tr>
               ))}
                </tbody>

          )
          }
          </table>
        </div>
    </div>
  )
}

export default QuizSubmissions
