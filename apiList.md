# DevTinder API's

authRouter
- POST /signup
- POST /login
- POST /logout

profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

connectionRequestRouter
- POST /request/send/interested/:toUserId
- POST /request/send/ignored/:toUserId
// we can have single api to handle both the cases => interested, rejected
- POST /request/send/:status/:toUserId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId
// we can have single API to handle both the cases => accepted, rejected
- POST /request/review/:status/:requestId

userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed

