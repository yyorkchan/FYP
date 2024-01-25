# FYP
This is Our FYP. ｡ﾟヽ(ﾟ´Д`)ﾉﾟ｡

## Important Notes
- Download the github pull request extension
- Clone this project to your vscode
- Run `yarn` After clone
- ALWAYS USE `yarn add` to install packages, avoid using `npm install`
- Use **Expo Go** to Debug
- Run `node index.js` in /backend to start express server

## Current To-Do List:
Next up (๑•̀ㅂ•́)و✧ 🔥
- Implement delete and filter in Home Screen
- Research what machine learning model to use

Done!  ✧◝(⁰▿⁰)◜✧ ✅
1. Build Home Page: Done!
2. Figure out how to navigate: Done!
3. Get familiar with Retool: Done!
4. Fix the hard code IP address problem: Done!
5. Build Add Record Page frontend: Done!
6. Handle insert sql query to retool database: Done!
7. Start working on interim present ppt: Next up
8. Start working on interim report: Next Next up
9. Add support for recurring records

## General Structure
### Frontend
- App.js is the main Javascript file that contains all the Pages to be navigate
- All 4 frontend pages should be contained in the folder "/frontend"
- All css should be included at the end of the corresponding frontend js, Read Homepage.js for the detailed formatting
### Backend
- index.js is the main Javascript file for express server which hosts records fetched back from retool
- retool.js runs sql queries on retool and get back records
