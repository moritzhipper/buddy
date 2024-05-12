# ToDo Backend
## Vorgehen generell
 - refacotring wo // refactor und // todo stehtw


## Doing right now
- tests fixen

- user und auth consolidieren nach frontend effect ordnung
- nur eine session generell erlauben, so entstehen keine synchronisationsprobleme zwischen clients -> update on conflict for session + ip index delete?
- auth nur via secret und email. email nur zum passwortreset
- consolidate user and profile routes (credentials and password change via user route, auth only for session and reset password and stuff)

## Short term
- add free_from to shared therapists to give assumption about when therapist is free earliest.
- only allow one session
- sessionID in cookie, buddy-secret und basic auth mit zod prüfen
- auth via buddy secret oder (buddy secret + pw) oder (email + pw); 
- expires, ip und browser in session table speichern und prüfen?
 - tests in github workflow mit pgpromise container laufen lassen halt 
 - therapists consolidieren über fuzzy matching:
    - https://www.crunchydata.com/blog/fuzzy-name-matching-in-postgresql
    - nächtliche übertragung der therapeuthen in separate therapists_cosolidated table

 - erstes login und passwort reset über nodemailer: https://nodemailer.com/

 
## Long term 
### Vor Monorepo
 - spätestes free from nutzen als free from time für therapeut
 - neue seite unverschlüsselt für anzeige therapeuthen in stuttart mit filtern oben
 - check parameter of validation schemes more specific (string length, enums, etc)
 - ratelimiting und basic sicherheitszeug für user anlegen und so
    - Rate limiting per clouddienst oder app
 - google express js best practices
    - Best Practises Performance https://expressjs.com/en/advanced/best-practice-performance.html
    - best practises Security http://expressjs.com/en/advanced/best-practice-security.html#use-cookies-securely


### Nach Monorepo
 -> Terapist Note erst erlauben, wenn nutzer full user ist?
 -> session wie das? [express-session](https://gist.github.com/samsch/0d1f3d3b4745d778f78b230cf6061452)
 - für suche optimierten index auf name? potentiel pg_trgm nutzen
 - passwort vergessen prozess
 - basic auth stuff 
   - token logik -> nur einmal basic auth, dann token in fe speichern
 - typings und validationschemes aus einer quelle
   - FE formvalidierung auch per ZodSchemes
 - Route names aus shared folder importieren

### Architektur

## offene punkte
  - note auch mit einfachem profil returnen? wegen datenschutz und so