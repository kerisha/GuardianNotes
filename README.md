# The Guardian (GuardianNotes) - Using AI and Pangea APIs

In this workflow, there are three applications working together to ensure the security and privacy of your confidential information. Let's dive into the function of each app:

Web App: The web app is where you add, view, edit, and delete your confidential notes. It acts as the primary interface for managing your sensitive information. One of the key features of this app is its AI-powered webcam verification, which ensures that only authorized users can access the notes. This adds an extra layer of security, preventing unauthorized individuals from gaining access to your confidential data.

Backend Notification App: This app comes into play when an unauthorized user attempts to access your confidential data. If the webcam verification fails to match the user's identity, the backend notification app is triggered. It swiftly sends out notifications to you through different channels, such as WhatsApp and Microsoft Teams. This real-time alert allows you to take immediate action and be aware of any potential security breaches.

GPT App: The GPT app is designed to analyze your user data and provide you with valuable insights and activity updates. It not only helps you monitor your account but also detects and reports any security breaches that might occur. By logging into the GPT portal, you can access detailed information about the security incidents, enabling you to understand the nature of the breach and take appropriate measures to safeguard your confidential data in the future.

# App Benefits

Unparalleled Security: With the combination of AI-powered webcam verification, real-time notifications, and insightful analysis, this workflow ensures the utmost security for your confidential information. You can have peace of mind knowing that only authorized users can access your data, and you will be immediately alerted in case of any unauthorized attempts.

Timely Alerts: The backend notification app promptly sends out notifications to your preferred channels, such as WhatsApp and Microsoft Teams. This ensures that you stay informed about any potential security breaches in real-time. By receiving instant alerts, you can quickly respond and take necessary actions to mitigate any risks.

Proactive Insights: The GPT app offers you the ability to monitor and analyze your account activity comprehensively. By logging into the portal, you gain valuable insights into your usage patterns and receive updates on any breaches that might have occurred. This proactive approach allows you to stay one step ahead and take preventive measures to enhance the security of your confidential information.

Empowering Control: The entire workflow empowers you with control over your data. You have the ability to add, edit, or delete notes securely using AI-powered webcam verification. Additionally, by accessing the GPT portal, you have a centralized location to manage and monitor your account, giving you full control and visibility over your sensitive information.

In summary, this application workflow provides a robust and comprehensive solution to safeguard your confidential data. By combining cutting-edge security measures, real-time notifications, and insightful analysis, it ensures your peace of mind and empowers you with the necessary tools to maintain the privacy of your information. With this app, you can confidently store your sensitive data, knowing that it is protected and monitored effectively.

# 📗🔐 Guardian Notes App 📗🔐

### Tech

Javascript web app

## How is Pangea APIs Used?

- Redact: When a note is created, sensitive information are redacted based on rules set in Pangea's console.
- Audit Log: Logs generated for user events: login, unathorized access to content, unathorized tampering

## To run:

- Go to the webapp folder
- Download `Live Server` for VS code
- Navigate to login.html file and open in browser
- Right click, open with Live Server
- Login (creds: admin for username and password)
- Use App (Add a note and proceed)

Note: Copy config_template.js and paste into a new file called config.js.
Place your environment specific configs in the file.
This is needed to get the app to run.

Also, an AI model has been trained to recognize the code owner's face. The training face data were not uploaded to Github. But, its demonstration will be seen in the video.

Train the app to recognize you:

- Create a folder called labels
- Create a subfolder for the name of person to be authorized (whose face is being used)
- This value will be the same as config.validUser
- In the valid user subfolder, add images and name them in incrementing integers starting from 1. For example: 1.png, 2.png, etc ...
- That's it, when you run the app, it will handle the processing

# 📢 Notifier App 📢

# Tech

Nodejs Express app

To run:
Navigate to the folder (notifier) in the terminal and execute:
`npm start`

The notifier App should be started locally on port 3009

Note: Copy config_template.js and paste into a new file called config.js.
Place your environment specific configs in the file.
This is needed to get the app to run.

# 🤖 Pangea GPT App 🤖

## How is Pangea APIs used?

Bot reaches out to Pangea's Audit Log service and updates the user on the events surrounding account activity and security breeches. Bot also gives security recommendations based on what it knows from the logs.

## Process Environment Variable

Set OPENAI_API_KEY to your Open API Key

Terminal: export OPENAI_API_KEY={key}

Verify set: echo $OPENAI_API_KEY <br>
Key should be displayed <br>

The server needs the above in order to successfully make requests to Open AI

Note: Copy config_template.js and paste into a new file called config.js.
Place your environment specific configs in the file.
This is needed to get the app to run.

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
