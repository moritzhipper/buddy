# DB Design Decisions

## Why seperate Tables for users' or shared Therapists and related data exist

- Enables enforcing a safe acces restriciton system for TUs interactiong with the DB

- Creates clean disitinction between publicly and private (for logged in users) accesible data

- Minimizes impact of errorneous consolidation runs

## Why are callTimes in a seperate table and not an Array of therapists tables?

To later allow querying therapists by specific callTimes. (eg.: Therapists in City callable today beeing available earliest ).