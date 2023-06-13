# The Guardian - Using AI and [Pangea](https://pangea.cloud/) APIs

In this workflow, there are five applications working together to ensure the security and privacy of your confidential information. Let's dive into the function of each app:

Web App (first): The web app is where you add, view, edit, and delete your confidential data. It acts as the primary interface for managing your sensitive information. One of the key features of this app is its AI-powered webcam verification, which ensures that only authorized users can access the data. This adds an extra layer of security, preventing unauthorized individuals from gaining access to your confidential data.

Backend Notification App (second): This app comes into play when an unauthorized user attempts to access your confidential data. If the webcam verification fails to match the user's identity, the backend notification app is triggered. It swiftly sends out notifications to you through different channels, such as WhatsApp and Microsoft Teams (third - another application in the solution). This real-time alert allows you to take immediate action and be aware of any potential security breaches.

GPT App: The GPT app is designed to analyze your user data and provide you with valuable insights and activity updates. It not only helps you monitor your account but also detects and reports any security breaches that might occur. By logging into the GPT portal, you can access detailed information about the security incidents, enabling you to understand the nature of the breach and take appropriate measures to safeguard your confidential data in the future. It consists of two application: the client (fourth) and the server (fifth).

# App Benefits

Unparalleled Security: With the combination of AI-powered webcam verification, real-time notifications, and insightful analysis, this workflow ensures the utmost security for your confidential information. You can have peace of mind knowing that only authorized users can access your data, and you will be immediately alerted in case of any unauthorized attempts.

Timely Alerts: The backend notification app promptly sends out notifications to your preferred channels, such as WhatsApp and Microsoft Teams. This ensures that you stay informed about any potential security breaches in real-time. By receiving instant alerts, you can quickly respond and take necessary actions to mitigate any risks.

Proactive Insights: The GPT app offers you the ability to monitor and analyze your account activity comprehensively. By logging into the portal, you gain valuable insights into your usage patterns and receive updates on any breaches that might have occurred. This proactive approach allows you to stay one step ahead and take preventive measures to enhance the security of your confidential information.

Empowering Control: The entire workflow empowers you with control over your data. You have the ability to add, edit, or delete data securely using AI-powered webcam verification. Additionally, by accessing the GPT portal, you have a centralized location to manage and monitor your account, giving you full control and visibility over your sensitive information.

In summary, this application workflow provides a robust and comprehensive solution to safeguard your confidential data. By combining cutting-edge security measures, real-time notifications, and insightful analysis, it ensures your peace of mind and empowers you with the necessary tools to maintain the privacy of your information. With this app, you can confidently store your sensitive data, knowing that it is protected and monitored effectively.

# 📗🔐 Guardian App 📗🔐 (/webapp)

## Tech

Javascript web app

## How are Pangea APIs Used?

- Redact: When a data is added, sensitive information are redacted based on rules set in Pangea's console.
- Audit Log: Logs generated for user events: login, unauthorized access to content, unauthorized tampering

Defined in code: scripts/pangea-apis.js </br>
Code usage: scripts/script.js

## Configuration

Note: Copy config_template.js (/scripts/config_template.js) and paste into a new file called config.js.
Place your environment specific configs in the config.js file.
Save the file.
This is needed to get the app to run.

config = {
redact_api_key : "{{PangeaAPIKey}}",
validUser : "{{AuthorizedUser}}",
audit_api_key : "{{PangeaAPIKey}}",
notifierUrl : "{{NotifierAppUrl}}",
}

## AI Model

Also, an AI model has been trained to recognize the authorized user / owner's face. The training face data were not uploaded to Github. But, its demonstration will be seen in the video.

Train the app to recognize you:

- Create a folder within the webapp folder called `labels`
- Create a subfolder and give it the name of the person to be authorized (whose face is being used). Example: `kerisha`
- This value will be the same as `config.validUser` in the config.js file
- In the valid user subfolder, add images of the authorized user and name them in incrementing integers starting from 1. For example: 1.png, 2.png, etc ...
- That's it, when you run the app, it will handle the processing

## To run:

- Go to the webapp folder
- Download `Live Server` for VS code
- Navigate to login.html file and open in browser
- Right click, open with Live Server
- Login (creds: username: kerisha, password: admin)
- Use App (Add data and proceed)

# 🦾 Teams bot (/teams-bot/SnooperAlert) 🦾

Teams bot responsible for sending out notifications to the authorized user via Microsoft Teams

## Dependencies

- VS Code
- Teams Toolkit Extension for VS Code

## To run

- On the sidebar, select the Debug icon to open the RUN AND DEBUG panel.
- On the RUN AND DEBUG panel, select either Chrome or Edge in the dropdown list box as the browser that you want to use to debug your bot. Then select the Play button (or select the F5 key) to start the debug session.
- In the installation dialog, select the Add button to install the app as a personal app.
- The endpoint URL for the bot will be `https://localhost:3978/api/notification`

# 📢 Notifier App 📢 (/notifier)

## Tech

Nodejs Express app

NB: This app makes an API call to another App - teamsbot/SnooperAlert

## Configuration

Note: Copy config_template.js and paste into a new file called config.js.
Place your environment specific configs in the config.js file.
Save the file.
This is needed to get the app to run.

config = {
whatsAppAuthToken: "{{TwilioAccountWhatsAppToken}}",
whatsAppAccountSID : "{{TwilioAccountSID}}",
whatsAppNumber : "{{TwilioWhatsAppNumber}}",
toNumber : "{{WhatsAppDestinationNumber}}",
microsoftTeamsUrl: "{{TeamsBotSnooperAlertUrl}}"
}

## To run:

Navigate to the folder (notifier) in the terminal and execute:
`npm start`

The notifier app should be started locally on port 3009

# 🤖 Pangea GPT App 🤖 (/pangeagpt-server and /pangeagpt-client)

## How is Pangea APIs used?

Audit Log: Bot reaches out to Pangea's Audit Log service and updates the user on the events surrounding account activity and security breeches. Bot also gives security recommendations based on what it knows from the logs.

Defined in code: pangeagpt-server/server.js </br>
Code usage: pangeagpt-server/server.js

## Server (/pangeagpt-server)

### Configuration

#### Process Environment Variable

Set OPENAI_API_KEY to your Open API Key

Terminal: export OPENAI_API_KEY={key}

Verify set: echo $OPENAI_API_KEY </br>
Key should be displayed </br>

#### Other configs

Note: Copy config_template.js and paste into a new file called config.js.
Place your environment specific configs in the config.js file.
Save the file.
This is needed to get the app to run.

config = {
audit_api_key: "{{PangeaAuditLogAPIKey}}",
domain: "{{PangeaDomain}}",
}

To run:

1. node server.js
   OR
2. npm start

## Client (/pangeagpt-client)

Run the app with a js bundler

Example: Parcel

Npm command: npm install parcel </br>
Parcel Command: parcel index.html

Note: Ensure server is running and Client is pointing to server. Update serverUrl in the App.js file
