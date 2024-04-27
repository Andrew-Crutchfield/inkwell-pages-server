
## Dev Environment Updates
* [Install Docker](https://docs.docker.com/desktop/install/mac-install/)
* Install Homebrew by copying and pasting this into a terminal: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
* `brew install postgresql@15`
* `docker-compose up` to run Postgres locally
* `psql -U pguser -d postgres -p 5432 -h localhost` should get you in (will prompt for password; see `docker-compose.yaml` for that)
* Install the Heroku CLI: `brew tap heroku/brew && brew install heroku`


## Initialize Database

CREATE DATABASE inkwell;
\c inkwell
CREATE USER inkwell_user WITH PASSWORD 'inkwell_password';
GRANT ALL PRIVILEGES ON DATABASE inkwell TO inkwell_user;
GRANT ALL ON SCHEMA public to inkwell_user;

After this, `psql -U inkwell_user -d inkwell -h localhost` gets you into your database

Once `psql` is installed, `heroku pg:psql postgresql-flat-72555 --app inkwell-pages` gets you into the Heroku database from the command line
