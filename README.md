# coinhaven

## Set Up
1. Install all packages
> npm install
2. Start your redis
3. Create your environment file
> cp .env.example .env
4. Change the environment file data to suit your environment

## Start the project
> npm start

## Routes
| Endpoint | HTTP |	Body Request | Info |
|----------|------|--------------|------|
| /	| GET	|	| Check API is up |
| /api/signup |	POST |	email, name, password	| Create new account |