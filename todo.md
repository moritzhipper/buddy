# ToDo

## Monorepo

### Right now

-  check if subscription acitvated

   -  no installation necessary, because service worker always is
      installed via turthyness of swPush (because its only avalable if serviceworker is available )

-  unsubscribe action aus service bei unsubscribe
   -  wie asyn in service????
-  effect und errorhandling gerade ziehen
-  in store einbauen methoden aus notification service
   -  browserissetupcorrectly
   -  backendknowsofsubscription
   -  dann okay an service
-  in store einbauen
   -  remove notifications
-  dann auch in settings ergänzen

-  read subscriptions from db in push service
-  allow multiple subscriptions for user
-  implement deletion of subscription
-  store subscription stuff encrypted
-  bei abmeldung notifications disablen
-  hat ein nutzer mehrer anrufbare therapeuten, dann müssen die in einer nachricht geschickt werden
-  change user for pushservice to read only for few tables?
-  wie handle ich mehrere subscriptions? eigentlich muss ich ein distinct check auf die subscription-url machen
-  bei profile lesen auslesen, ob notifications gesendet werden dürfen (geht das?)
-  benachrichtigungsstatus in den settings: erlauben/verbieten

SELECT
s.user_id,
STRING_AGG(ut.name, ', ') AS therapist_names,
s.subscription
FROM subscriptions s
JOIN users_therapists ut ON s.user_id = ut.user_id
JOIN users_call_times uct ON ut.id = uct.therapist_id
WHERE uct."from" = '13:15'
GROUP BY s.user_id, s.subscription;
der geht, ausser equality operation auf subscription

https://blog.angular-university.io/angular-push-notifications/
https://v17.angular.io/guide/service-worker-notifications

### Soon

-  Toasts -> toast Erfolgsmeldungen auch über store regeln (Löschen von therapeuten, etc, einfach im code nach toasts suchen)
-  impressum, about und info page updaten und texte gerade ziehen
-  Tipps in app anzeigen 'Du hast auch eine Adresse gefunden? Üertrage sie doch auch, damit andree Suchende davon profitieren können :)' -> Dazu sweete hintergrundbilder für sympathie und hilfsbereitschaft
-  wenn therapeut keine infos ztu feld hat, anzeigen unter 'noch nicht angegeben' kategorie -> wie umgehen, wenn therapieart nicht angegeben?
-  auf datenschutzseite Feld: Was speichern wir von dir? mit feldbasierter antwort. Verweis auf datenschutzpage
-  merken seite refaktoren: oben a la search: therapeut anlegen
-  therapeutensektionen: frei in der zukunf
-  bin auf warteliste
-  print button (du suchst für eine andere person? Drucke deine Suche aus!)
-  wie man schnell einen therapieplatz findet zusammenfassen? ist gedoppelte inf. und eventuell aus akkordeon raus bewegen
-  qr-key auch in tutorial als text kopieren
-  aus tutorial therapie begleiten seite entfernen (in tutorial direkt auch datenschutz zustimmung drin haben?)
-  coole datenschutz bestätigen animation
-  therapytypes allowed in zod schemes
-  therapeut teilen

-  tests vom be umziehen, dann types importieren

-  Shared Prod and Env Environment for both projects: [text](https://nx.dev/recipes/tips-n-tricks/define-environment-variables)
   -  handling shared configuration: über env oder nicht env?
-  env, db und tests aus backend nachziehen

-  projecte umbenennen in frontend, backend, push-service

-  gemeinsames helfen an erste stelle schreiben: du hilfst anderen durch eintröge. teile mit deinen freunden, damit sie auch teil haben. beteilige dich an dem projekt auf github!

## Frontend

-  replace two medie query types with types and conteiner query
-  info page: wie funktioniert das? -> Therapeuten Prozess erklären
-  therapeutendaten teilen ausbauen
-  e2e tests auf playwright umstellen?
-  reset button zentral
-  button styles definieren (line, voll bestätigen zurück)

## Backend

-  e2e tests in projekt migrieren

##

{"publicKey":"BBZYBgvEegKC57oonu8SiZ64A0Xq3MktHLTgs7oJYaw2iQ7j5Qa_TVaHTrmS3gXGIn_lRtq0BJopaEIpu0755ao","privateKey":"QD71gGi7PZlv-HHGQK-HSWbMCXsUNOt2Sb9dV9C93OU"}
