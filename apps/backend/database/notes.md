# Postgres + Docker
 - https://dev.to/andre347/how-to-easily-create-a-postgres-database-in-docker-4moj
 - auslagern in eigenes projekt


# DB init script source
 - groß und kleinschreibung der email wichtig (wtf) WB
 - https://dbdiagram.io/d/buddy-65268db6ffbf5169f07afde3
# build and run buddy db q
  - build image `sudo podman build -t buddy-db -f Dockerfile`
  - run image, expose postgresport to local system `podman run -p 4444:5432 containername`
  - connect to psql in container `psql -h localhost -U postgres -p 4444`

# run psql locally
start service: `systemctl start postgresql`

switch to postgres user: `sudo -u postgres -i`
or connect to postgres service running locally: `psql -h localhost -U postgres`

# ToDo Database
 - Therapeuten
    - neue table für therapueten von user
    - therapeuten_gesammelt table
 - DB vertesten per Integration tests mit FE
 - authenthifizierungsprozess entwerfen
    - oauth? welcher flow? -> https://oauth.net/2/browser-based-apps/
 - authentifizierungsprozess in db abbilden
     - password storen so https://x-team.com/blog/storing-secure-passwords-with-postgresql/
 - authentifizierungsprozess in be abbilden
 - authentifizierungsprzess in fe abbilden
 - user management for db -> update rights, delete rights, tablespecific
