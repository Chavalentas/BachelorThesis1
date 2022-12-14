# Usage instructions
To run the database, use the command **docker-compose up** in the Command line.
Open your browser in **http://localhost:8081**.

## Prerequisites
Installation of Docker and Docker Desktop for your operating system.

## Database setup
1. Create the containers using the command **docker-compose up** in the Command line.
2. Open your browser in **http://localhost:8081**.
3. Login with the following data: admin@admin.com (email address), secret (password).
4. Create a new server with the following data:
   * Hostname/address: postgres_container
   * Port: 5432
   * Maintenance database: postgres
   * Username: admin
   * Password: secret
5. Create a new table using the following code snippet:
```
      create table if not exists users
      (
        id serial primary key,
        email text unique,
        userName text unique,
        passWord text,
        creationDt timestamp
      );
```

Should you experience any troubles creating the server, this may be due to the pgadmin version set in the **docker-compose.yml** file.
In order to fix this, change the version in ```image: dpage/pgadmin4:<version>``` to the latest one. 
The latest version can be found [here](https://www.pgadmin.org/).