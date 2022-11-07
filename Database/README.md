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