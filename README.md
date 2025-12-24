
# SkillBites

In today’s modern era where technology has evolved and people started to rely more on online 
courses rather than going to colleges, we have come up with a user-friendly platform that makes 
online learning easy and engaging. This project focuses on using the latest tech to make 
personalized learning experiences. We work to make online education simple and accessible for 
everyone. This project aims to create an engaging and informative online course that helps 
learners achieve the desired learning outcomes. 


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file.

### Navigate to Server folder
    cd Server
    touch .env
#### Generate keys from cloudinary.

`CLOUD_NAME` = "your cloud name"

`CLOUD_API_KEY` = "your cloud api key"

`CLOUD_API_SECRET` = "your cloud api secret" 

#### Generate keys from razorpay

`RAZORPAY_API_KEY`= "your razorpay api key"

`RAZORYPAY_API_SECRET`= "your razorpay api secret"

#### Add mongodb url here

`MONGO_URL`= "your mongodb url"

#### Create a gmail service provider pass key and add it to gmail gmail password

`GMAIL_USERNAME`= "your email"

`GMAIL_PASSWORD`="your email passkey"

`JWT_SECRET`= "your jwt secret"

`JWT_REFRESH_SECRET`= "your jwt refresh secret"

### Navigate to classroom-project

    cd classroom-project
    touch .env

`REACT_APP_API_URL`= 'your backend localhost url'
`REACT_APP_RAZORPAY_API_KEY`= 'your razorpay api key'

## Installation

Clone the project

```bash
  git clone https://github.com/HellTanmay/SkillBites.git
```
Install classroom-project with npm

```bash
  cd classroom-project
  npm install
```

Install Server with npm

```bash
  cd Server
  npm install
```
Run the project

```bash
  cd classroom-project
  npm start
  cd ..
  cd Server
  npm start
```
