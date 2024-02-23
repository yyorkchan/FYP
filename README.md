# FYP

This is Our FYP. ｡ﾟヽ(ﾟ ´Д`)ﾉﾟ｡

## Important Notes

- Download the github pull request extension
- Clone this project to your vscode
- Run `yarn` After clone
- ALWAYS USE `yarn add` to install packages, avoid using `npm install`
- Use **Expo Go** to Debug
- Run `node index.js` in /backend to start express server

## Current To-Do List:

Next up (๑•̀ㅂ•́)و✧ 🔥

- Research what machine learning model to use (York)

Done! ✧◝(⁰▿⁰)◜✧ ✅

1. Build Home Page: Done!
2. Figure out how to navigate: Done!
3. Get familiar with Retool: Done!
4. Fix the hard code IP address problem: Done!
5. Build Add Record Page frontend: Done!
6. Handle insert sql query to retool database: Done!
7. Start working on interim present ppt: Done!
8. Start working on interim report: Done!
9. Add support for recurring records
10. Added Delete records function: Legendarily Done! ٩(｡・ω・｡)و
11. Implement Sort & Filter in Home Screen
12. Only Allow Non-empty value in Add Screen

## General Structure

### Frontend

- App.js is the main Javascript file that contains all the Pages to be navigate
- All 3 frontend pages should be contained in the folder "/frontend"
- All unique css should be included at the end of the corresponding frontend js, Read Homepage.js for the detailed formatting
- All common css should be included in "style.js", including fontSize, windowSizes etc.
- Functions for filtering and sorting are located in "filterSort.js"
- Helper functions are located in "util.js"

### Backend

- index.js is the main Javascript file for express server which hosts fetch, add and delete endpoint via retool
- retool.js runs sql queries on retool, retrieving, adding and deleting records
