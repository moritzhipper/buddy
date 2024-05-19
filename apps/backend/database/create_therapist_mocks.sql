-- mock consolidated therapists table

-- insert therapists
WITH inserted_therapists AS (
    INSERT INTO "shared_therapists" (name, email, phone, therapy_types)
    VALUES
    ('Dr. Hans Müller', 'hans.muller@example.de', '+49 123 4567890', ARRAY['verhalten']),
    ('Anna Schmidt', 'anna.schmidt@example.de', '+49 234 5678901', ARRAY['systemisch', 'paar']),
    ('Prof. Dr. Julia Schneider', 'julia.schneider@example.de', '+49 345 6789012', ARRAY['psychoanalyse']),
    ('Michael Fischer', 'michael.fischer@example.de', '+49 456 7890123', ARRAY['gestalt']),
    ('Laura Weber', 'laura.weber@example.de', '+49 567 8901234', ARRAY['analytisch']),
    ('Dr. David Meyer', 'david.meyer@example.de', '+49 678 9012345', ARRAY['verhalten']),
    ('Sarah Wolff', 'sarah.wolff@example.de', '+49 789 0123456', ARRAY['gruppe']),
    ('Tobias Wagner', 'tobias.wagner@example.de', '+49 890 1234567', ARRAY['gespraech']),
    ('Dr. Klara Bauer', 'klara.bauer@example.de', '+49 901 2345678', ARRAY['tiefenpsychfundiert']),
    ('Eva Hoffmann', 'eva.hoffmann@example.de', '+49 123 4567899', ARRAY['paar']),
    ('Markus Koch', 'markus.koch@example.de', '+49 234 5678902', ARRAY['psychoanalyse']),
    ('Lisa Zimmermann', 'lisa.zimmermann@example.de', '+49 345 6789013', ARRAY['gestalt']),
    ('Jan Schwarz', 'jan.schwarz@example.de', '+49 456 7890124', ARRAY['analytisch']),
    ('Sophia Braun', 'sophia.braun@example.de', '+49 567 8901235', ARRAY['verhalten']),
    ('Prof. Dr. Stefan Neumann', 'stefan.neumann@example.de', '+49 678 9012346', ARRAY['gruppe']),
    ('Christina Schmitt', 'christina.schmitt@example.de', '+49 789 0123457', ARRAY['gespraech']),
    ('Paul Walker', 'paul.walker@example.de', '+49 890 1234568', ARRAY['psychoanalyse']),
    ('Felia Flieder', 'felia.flieder@example.de', '+49 890 1234568', ARRAY['verhalten', 'gespraech']),
    ('Laura Allen', 'laura.allen@example.de', '+49 901 2345679', ARRAY['gestalt'])
    RETURNING id
)
INSERT INTO "shared_addresses" (therapist_id, street, number, city, postal_code)
SELECT id, 'Main Street', '123', 'Springfield', '12345'
FROM inserted_therapists;

-- add two call times to all therapists
INSERT INTO "shared_call_times" ("therapist_id", "from", "to", "weekday")
SELECT t.id, '09:15', '10:00', 'mo' FROM "shared_therapists" t
UNION ALL
SELECT t.id, '10:20', '10:00', 'di' FROM "shared_therapists" t;

