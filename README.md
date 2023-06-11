# 📗🔐 Guardian Notes App 📗🔐

A secure notes/ memo/ journal app

- Add short notes
- Choose different colors for notes
- Note security if you (owner) is not present
- Audit Logs for suspicious behavior

![nnn]()

## Built with

html, css, bootstrap and vannila Js

## To run:

- Download `Live Server` for VS code
- Navigate to login.html file and open in browser
- Right click, open with Live Server
- Login
- Use App

# 📢 Notifier App 📢

Server side code that reaches out to the user via WhatsApp or Microsoft Teams when it detects suspicious behavior on the user's account.

To run:
Navigate to its folder in the terminal and execute:
`npm start`

The notifier App should be started locally on port 3009

# Pangea GPT App

## Bot reaches out to Pangea's Audit Log service and updates the user on account activity. Bot also gives security recommendations based on what it knows.

## Process Environment Variable

Set OPENAI_API_KEY to your Open API Key

Terminal: export OPENAI_API_KEY={key}

Verify set: echo $OPENAI_API_KEY <br>
Key should be displayed <br>

The server needs the above in order to successfully make requests to Open AI

## Server

To run:

1. node server.js
   OR
2. npm start

## Client

Run the app with a js bundler

Example: Parcel

Npm command: npm install parcel <br>
Parcel Command: parcel index.html

Note: Ensure server is running and Client is pointing to server. Update serverUrl in the App.js file
