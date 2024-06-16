# Project Unknown

Project Unknown is a unique platform designed for gamers, combining the best elements of a social media app and a professional networking site like LinkedIn. Gamers can showcase their achievements, skills, and other gaming-related activities. Teams and organizations can discover talented players and recruit them to kickstart their gaming careers.

## Features

- **Profile Creation:** Gamers can create detailed profiles to highlight their skills, achievements, and gaming history.
- **Networking:** Connect with other gamers, join teams, or find organizations looking for new talent.
- **Recruitment:** Teams and organizations can browse through profiles to find and recruit players.
- **Achievements:** Post and share gaming achievements and milestones.
- **Opportunities:** Look for gaming career opportunities and team openings.

## Getting Started

Follow these instructions to set up the project on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following tools installed on your local development environment:

- **Node.js** (v14 or later)
- **Yarn** (v1.22 or later)
- **TypeScript** (v4.0 or later)
- **MongoDB** (if using locally)
- **direnv** (for managing environment variables)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/project-unknown.git
   cd project-unknown 

2. **Install Dependencies**

Use Yarn to install the project dependencies:

   ```bash
   yarn install 
   ```

3. **Set Up Environment Variables**

Create a .envrc file in the root of the project and add the necessary environment variables. You can create and populate this file with the following commands:

   ```bash
   echo 'export FASTIFY_PORT=3000' >> .envrc
   echo 'export ESLINT_USE_FLAT_CONFIG=true' >> .envrc 

   echo "export MONGODB_CONNECTION_STRING='mongodb://localhost:27017/project-unknown'" >> .envrc
   echo 'export MONGODB_DATABASE=project-unknown' >> .envrc
   echo 'export DB_POOL_SIZE=20' >> .envrc

   echo 'export JWT_SECRET=your_jwt_secret' >> .envrc
   echo "export TOKEN_EXPIRATION='1d'" >> .envrc

   echo 'export MAX_FILE_SIZE=96' >> .envrc
   ```

4. **After creating the .envrc file, use direnv to allow loading the environment variables automatically:**

   ```bash
   direnv allow 
   ```


5. **Compile the TypeScript code to JavaScript using the build command:**

   ```bash
   yarn build
   ```
   Run the Migrations

Apply the necessary database migrations:

bash
Copy code
yarn migration:up
Start the Server

Start the Fastify server:

bash
Copy code
yarn start
The server should now be running at http://localhost:3000.

Development
For development purposes, you can use the dev command to build and start the project in one go:

bash
Copy code
yarn dev
This command will build the project and start the server in development mode.

Commands
Here’s a table summarizing the various Yarn commands available in this project:

Command	Description
yarn dev	Builds the project and starts the server in development mode.
yarn start	Starts the server using the compiled code in the dist directory.
yarn build	Cleans the dist directory and compiles TypeScript to JavaScript.
yarn gql-gen	Generates GraphQL types and operations based on the codegen.yaml configuration.
yarn db-gen-types	Converts the JSON database schema into TypeScript types and saves them in src/generated/.
yarn lint	Runs ESLint on the src directory and automatically fixes issues.
yarn purge	Removes the node_modules and dist directories to clean up the project.
yarn migration:up	Runs the database migrations to set up the current schema.
yarn migration:down	Rolls back the most recent database migration.
Explanation of Environment Variables
To help you understand the specific environment variables required for the project:

FASTIFY_PORT: The port on which the Fastify server listens for incoming requests.
ESLINT_USE_FLAT_CONFIG: Boolean flag indicating whether to use ESLint's flat configuration.
MONGODB_CONNECTION_STRING: The connection string used to connect to the MongoDB database.
MONGODB_DATABASE: The specific MongoDB database to use.
DB_POOL_SIZE: Configures the maximum number of simultaneous connections that MongoDB client can handle.
JWT_SECRET: Secret key for signing JWT tokens. It's essential for securing user authentication.
TOKEN_EXPIRATION: Defines how long the JWT tokens are valid. For instance, '1d' means the token is valid for one day.
MAX_FILE_SIZE: Sets the maximum allowable file size for uploads, in megabytes.
Contributing
We welcome contributions from the community. If you want to contribute to this project, please fork the repository and submit a pull request with your changes. Make sure to follow the code style and add tests for your changes.
