import {configureStore} from '@reduxjs/toolkit'
import courseReducer from './CourseSlice'
import lectureReducer from './RecordSlice'
import assignmentReducer from './AssignSlice'
import UserReducer from './UserSlice'
import SubmitReducer  from './SubmitSlice'
import extraReducer from './ExtraSlice'
import PaymentReducer from './PaymentSlice'
import QuizzReducer from './QuizzSlice'

export const store=configureStore({
    reducer:{
        User:UserReducer,
        course:courseReducer,
        Lecture:lectureReducer,
        Assignment:assignmentReducer,
        Submissions:SubmitReducer,
        Extras:extraReducer,
        Payments:PaymentReducer,
        Quizzes:QuizzReducer,
    }
})