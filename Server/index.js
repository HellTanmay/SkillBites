import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { ErrorHandler } from "./Middleware/errorHandler.js";
import cookieParser from "cookie-parser";

//Routes
import UserRoutes from './Routes/UserRoute.js'
import courseRoutes from './Routes/CourseRoute.js'
import courseContentRoutes from './Routes/CourseContentRoute.js'
import quizRoutes from './Routes/QuizRoute.js'
import paymentRoute from './Routes/PaymentRoute.js'
import miscRoutes from './Routes/MiscRoutes.js'
import AppError from "./utils/error.js";

const app = express();

config({ path: "./.env" });


var corsOptions = {
  origin: ['http://localhost:3000', 'https://skillbites-frontend.onrender.com'],
  credentials:true
}
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/pdf", express.static(__dirname + "/pdf"));

// app.use(express.static(path.join(__dirname, 'classroom-project/build')));



mongoose.connect(process.env.MONGO_URL )
  .then(() => {
    console.log("Connection successful");
  })
  .catch((error) => {
    console.log(error);
  });

 
app.use(UserRoutes)
app.use(courseRoutes)
app.use(courseContentRoutes)
app.use(quizRoutes)
app.use(paymentRoute)
app.use(miscRoutes)

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'classroom-project/build', 'index.html'));
// }); 

app.listen(process.env.PORT, () => {
  console.log(`Server is running in port ${process.env.PORT||4000}`);
});
app.use(ErrorHandler);


