# Easy Language app backend
Written in node.js and NestJS framework.

## What is it?
Backend for a cross-platform app for learning new languages.

Authentication using an <b>e-mail address or google authentication token</b>.<br>
User logs in with e-mail and a password or by providing a valid google auth token (generated on frontend).<br>
User receives a <b>JWT token</b> for further API use and a <b>refresh token</b> used to refresh the JWT token.

### Frontend
Frontend [flutter](https://flutter.dev) app: [easy_language](https://github.com/adam-podkowinski/easy_language)

### Trello
Trello board: [https://trello.com/b/V8EUc7b3/easy-language](Trello)

## Endpoints
Endpoints are distributed across 4 controllers:<br>`authentication.controller.ts`, `users.controller.ts`, `words.controller.ts`, `dictionaries.controller.ts`
- `/authentication/`
  - POST `/authentication/register`
  - POST `/authentication/login`
  - GET `/authentication/refresh`
  - POST `/authentication/google-authentication`
- `/user/`
  - GET `/user/`
  - PATCH `/user/`
  - GET `/user/logout`
  - DELETE `/user/`
- `/words/`
  - POST `/words/`
  - GET `/words/`
  - GET `/words/:id`
  - PATCH `/words/:id`
  - DELETE `words/:id`
- `/dictionaries/`
  - POST `/dictionaries`
  - GET `/dictionaries`
  - GET `/dictionaries/:id`
  - GET `/dictionaries/:id/words`
  - PATCH `/dictionaries/:id`
  - DELETE `/dictionaries/:id`
