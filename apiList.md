# Dev Tinder APIs
AUTH
- POST /signup
- POST /login
- POST /logout

PROFILE
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

CONNECTIONREQUESTHANDLER
- POST /request/send/interested/:id
- POST /request/send/ignored/:id
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

USERROUTER
- GET /connections
- GET /requests/received
- GET /feed
