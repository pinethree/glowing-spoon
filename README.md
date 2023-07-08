# glowing-spoon

This repo use for assignment of Vrillar, the name is random when create repo :)

## How to setup

**Make sure you have [Docker](https://www.docker.com/) on your machine, if you don't know about it or don't want to install it, we can stop here, I fail.**

### Manual

- Make sure you have the `make` command and Node.js LTS installed.
  - Assuming you are familiar with Docker setup and have Docker running.
  - Most likely, you already have the `make` command available.
- Navigate to the root of the project `glowing-spoon/`
  - Run `npm install` to install dependencies.
  - Run `make postgresinit` to start a Docker container named `postgresalpine`.
  - Run `make preparedb`: to set up the `vrillar` database and copy data from host machine to the container mentioned above.
  - Run `make seeddb`: to create tables and import data into those tables.
- Run `npm start` to start the server.
- You now have your server listening and serving at `localhost:8294`.

### Docker

- Navigate to the root of the project `glowing-spoon/`.
- Run `docker compose up -d` to start both database and application ( or `docker-compose up -d` if you are on Windows).
- Run `docker exec -it vrillar_db psql -U root -d vrillar -f /sql/import.sql` to seed the database.
- You now have your server listening and serving at `localhost:8294`.
- To clean up
  - Run `docker compose down` (`docker-compose down` on Windows) in the root of the project `glowing-spoon/`
  - Run `docker rmi glowing-spoon-app` to remove the docker image

### Minikube

- Ensure your machine have `kubectl`, `minikube`, `lens k8s`
- Build crawler image `docker build -t <name>:<tag> -f Dockerfile.crawler .`
- Build postgres image `docker build -t <name>:<tag> -f Dockerfile.postgres .`
- Build app image `docker build -t <name>:<tag> -f Dockerfile .`
- Load images into minikube `minikube image load <image>`
- `kubectl apply -f deployment.yml `

## Endpoints available

You can navigate to `localhost:8294/api-docs` to see available endpoints.

## Project structure

---

```
.
├── Makefile
├── README.md
├── dist
├── setup
│   ├── crawler.js
│   ├── data
│   │   ├── drivers.csv
│   │   ├── races.csv
│   │   └── teams.csv
│   └── sql
│       └── import.sql
├── src
│   ├── app.ts
│   ├── controllers
│   │   ├── driver.controller.ts
│   │   ├── race.controller.ts
│   │   └── team.controller.ts
│   ├── db
│   │   └── connection.ts
│   ├── routes
│   │   └── index.ts
│   ├── services
│   │   ├── driver.service.ts
│   │   ├── race.service.ts
│   │   └── team.service.ts
│   └── types
│       └── index.ts
└── tsconfig.json
```

- Makefile: A file used to define and run tasks (run container, create db,...) using the make utility.
- README.md: This file
- setup: A directory containing scripts and data files for bootstrap the project.
  - crawler.js: Script to crawl data from [https://www.formula1.com/](https://www.formula1.com/en/results.html/2023/races.html).
  - data: containing CSV files with data (e.g., drivers, races, teams).
  - sql: A directory containing SQL files for database setup and data import.
- src: The main source code directory.
  - app.ts: The entry point of the application.
  - controllers: A directory for defining controllers that handle incoming requests.
  - db: A directory for database-related code, such as database connection setup.
  - routes: A directory for defining API routes and their corresponding handlers.
  - services: A directory for defining business logic services.
  - types: A directory for defining custom TypeScript types and interfaces.
- tsconfig.json: A configuration file for the TypeScript compiler that specifies compilation options and project settings.

## Techs choice and reason

- [Express](https://www.npmjs.com/package/express) is the default choice for building REST APIs.
- [Kysely](https://www.npmjs.com/package/kysely): (pronounced "Key-Seh-Lee") is a type-safe and autocompletion-friendly TypeScript SQL query builder.
  - I feel that using an ORM would be overkill for this project.
  - Writing raw SQL can be a pain, especially when we need to create dynamic queries.
  - Query builders strike a sweet balance; they are easy to set up and incredibly powerful.
  - Btw, I discovered `kysely` during this project, and I had a lot of fun learning something new.
- **Postgres** is the chosen relational database.
  - Judging from the data, it seems that the entities are closely related (e.g., a driver belongs to a team, a race may have many participating teams).
  - I have no clue about MongoDB,so PostgreSQL was the natural choice.
- **Minor things**
  - I use [ts-standard](https://www.npmjs.com/package/ts-standard) a TypeScript style guide, along with a linter and an automatic code fixer based on StandardJS.
    - Setting up eslint, prettier, and webpack would be overkill for this project.
    - Some may argue that setting up a linter is unnecessary, but I believe that beautiful code is important, so I've included a simple yet effective linter in the project.
