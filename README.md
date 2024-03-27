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

- Implement a graph for display predicted values (York)
- (Optional) Use a LLM to describe the trend (York)

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
13. Built partially the trend screen frontend
14. Powerful and efficient regression model for processing transactions

## General Structure

### Frontend

- App.js is the main Javascript file that contains all the Pages to be navigate
- All 3 frontend pages should be contained in the folder "/frontend"
- All unique css should be included at the end of the corresponding frontend js, Read Homepage.js for the detailed formatting
- All common css should be included in "style.js", including fontSize, windowSizes etc

### Backend

- index.js is the main Javascript file for express server which hosts fetch, add and delete endpoint via retool
- retool.js runs sql queries on retool, retrieving, adding and deleting records

### Util

- filterSort.js contains functions for filtering and sorting transactions
- helper.js contains miscellaneous functions and some generic constants
- estimator.js contains regression models with pre-preprocessing functions

### Points to note when working with regression
- The "predict" function in "TrendScreen.js" is responsible for producing the predictions. It returns nextDisplayTimes and nextValues
- nextDisplayTimes is an array of date string, in format DD/MM or MM/YY according to duration
- nextValues is an array of predicted values corresponding to the dates in nextDisplayTimes
- You may see their values in Expo console after pressing the "predict" button in the TrendScreen
