# TWITTER STREAMER BACKEND

This the backend for the twitter streamer app. The frontend can be found in-  
https://github.com/anupjyotikalita/twitter-streamer-frontend

<br />
<br />

## HOW TO USE

1. Clone the repository  
```
git clone https://github.com/anupjyotikalita/twitter-streamer-backend.git
```

2. npm install in the root directory  
```
npm install
```

3. Add .env file to the root directory and add the following variable  
```
PORT=<port_to_run>
TWITTER_BEARER_TOKEN=<Twitter_developer_app_bearer_token>
FRONTEND_URL=<frontend_url>
```

for example,
```
PORT=5000
TWITTER_BEARER_TOKEN=AAAA*****************jvU
FRONTEND_URL=http://localhost:8000
```

<br/>

4. Start the backend  
```
npm run start:dev
```

*Once the backend is started, you can run the frontend and use the app. The frontend can be found here-*
https://github.com/anupjyotikalita/twitter-streamer-frontend
