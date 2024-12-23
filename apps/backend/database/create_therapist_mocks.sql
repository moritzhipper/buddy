INSERT INTO shared_therapists (name, email, phone, therapy_types) VALUES
('Dr. Felia Flieder', 'felia.flieder@example.com', '089 4567810', ARRAY['Gesprächspsychotherapie', 'Systemische Therapie']),
('Dr. Hans Müller', 'hans.mueller@example.com', '089 1234567', ARRAY['Verhaltenstherapie']),
('Dr. Anna Schmidt', 'anna.schmidt@example.com', '089 2345678', ARRAY['Kognitive Verhaltenstherapie (KVT)', 'Psychoanalyse']),
('Dr. Peter Fischer', 'peter.fischer@example.com', '089 3456789', ARRAY['Tiefenpsychologisch fundierte Psychotherapie']),
('Dr. Julia Weber', 'julia.weber@example.com', '089 4567890', ARRAY['Gesprächspsychotherapie', 'Systemische Therapie']),
('Dr. Michael Wagner', 'michael.wagner@example.com', '089 5678901', ARRAY['Gestalttherapie']),
('Dr. Laura Becker', 'laura.becker@example.com', '089 6789012', ARRAY['Interpersonelle Psychotherapie (IPT)']),
('Dr. Thomas Hoffmann', 'thomas.hoffmann@example.com', '089 7890123', ARRAY['Dialektisch-Behaviorale Therapie (DBT)']),
('Dr. Sandra Richter', 'sandra.richter@example.com', '069 8901234', ARRAY['Schema-Therapie']),
('Dr. Markus Schulz', 'markus.schulz@example.com', '069 9012345', ARRAY['Narrative Therapie']),
('Dr. Claudia Bauer', 'claudia.bauer@example.com', '069 0123456', ARRAY['Kunsttherapie']),
('Dr. Andreas Klein', 'andreas.klein@example.com', '069 1234560', ARRAY['Musiktherapie']),
('Dr. Lena Wolf', 'lena.wolf@example.com', '069 2345670', ARRAY['Tanztherapie']),
('Dr. Stefan Neumann', 'stefan.neumann@example.com', '069 3456780', ARRAY['Achtsamkeitsbasierte Therapieansätze']),
('Dr. Birgit Schwarz', 'birgit.schwarz@example.com', '069 4567890', ARRAY['Verhaltenstherapie', 'Kognitive Verhaltenstherapie (KVT)']),
('Dr. Frank Meyer', 'frank.meyer@example.com', '0711  5678900', ARRAY['Tiefenpsychologisch fundierte Psychotherapie']),
('Dr. Anja Zimmermann', 'anja.zimmermann@example.com', '0711 6789010', ARRAY['Psychoanalyse', 'Gesprächspsychotherapie']),
('Dr. Oliver Krüger', 'oliver.krueger@example.com', '0711 7890120', ARRAY['Systemische Therapie']),
('Dr. Katrin Hartmann', 'katrin.hartmann@example.com', '0711 8901230', ARRAY['Gestalttherapie', 'Interpersonelle Psychotherapie (IPT)']),
('Dr. Christian Lange', 'christian.lange@example.com', '0711 9012340', ARRAY['Dialektisch-Behaviorale Therapie (DBT)', 'Schema-Therapie']),
('Dr. Nina König', 'nina.koenig@example.com', '0711 0123450', ARRAY['Narrative Therapie', 'Kunsttherapie']);

INSERT INTO shared_call_times (therapist_id, "from", "to", weekday) VALUES
((SELECT id FROM shared_therapists WHERE name='Dr. Felia Flieder'), '08:00', '12:00', 'mo'),
((SELECT id FROM shared_therapists WHERE name='Dr. Felia Flieder'), '14:00', '18:00', 'mi'),
((SELECT id FROM shared_therapists WHERE name='Dr. Hans Müller'), '08:00', '12:00', 'mo'),
((SELECT id FROM shared_therapists WHERE name='Dr. Anna Schmidt'), '10:00', '14:00', 'di'),
((SELECT id FROM shared_therapists WHERE name='Dr. Peter Fischer'), '09:00', '13:00', 'mi'),
((SELECT id FROM shared_therapists WHERE name='Dr. Peter Fischer'), '10:00', '11:00', 'do'),
((SELECT id FROM shared_therapists WHERE name='Dr. Julia Weber'), '08:00', '12:00', 'do'),
((SELECT id FROM shared_therapists WHERE name='Dr. Michael Wagner'), '10:00', '14:00', 'fr'),
((SELECT id FROM shared_therapists WHERE name='Dr. Laura Becker'), '09:00', '13:00', 'sa'),
((SELECT id FROM shared_therapists WHERE name='Dr. Thomas Hoffmann'), '08:00', '12:00', 'mo'),
((SELECT id FROM shared_therapists WHERE name='Dr. Sandra Richter'), '10:00', '14:00', 'di'),
((SELECT id FROM shared_therapists WHERE name='Dr. Markus Schulz'), '09:00', '13:00', 'di'),
((SELECT id FROM shared_therapists WHERE name='Dr. Markus Schulz'), '09:00', '13:00', 'mi'),
((SELECT id FROM shared_therapists WHERE name='Dr. Claudia Bauer'), '08:00', '12:00', 'do'),
((SELECT id FROM shared_therapists WHERE name='Dr. Andreas Klein'), '10:00', '14:00', 'fr'),
((SELECT id FROM shared_therapists WHERE name='Dr. Lena Wolf'), '09:00', '13:00', 'sa'),
((SELECT id FROM shared_therapists WHERE name='Dr. Lena Wolf'), '09:00', '13:00', 'di'),
((SELECT id FROM shared_therapists WHERE name='Dr. Lena Wolf'), '11:00', '12:00', 'mo'),
((SELECT id FROM shared_therapists WHERE name='Dr. Stefan Neumann'), '08:00', '12:00', 'mo'),
((SELECT id FROM shared_therapists WHERE name='Dr. Birgit Schwarz'), '10:00', '14:00', 'di'),
((SELECT id FROM shared_therapists WHERE name='Dr. Frank Meyer'), '09:00', '13:00', 'mi'),
((SELECT id FROM shared_therapists WHERE name='Dr. Anja Zimmermann'), '08:00', '12:00', 'do'),
((SELECT id FROM shared_therapists WHERE name='Dr. Oliver Krüger'), '10:00', '14:00', 'fr'),
((SELECT id FROM shared_therapists WHERE name='Dr. Katrin Hartmann'), '09:00', '13:00', 'sa'),
((SELECT id FROM shared_therapists WHERE name='Dr. Christian Lange'), '08:00', '12:00', 'mo'),
((SELECT id FROM shared_therapists WHERE name='Dr. Nina König'), '10:00', '14:00', 'di');

INSERT INTO shared_addresses (therapist_id, street, number, city, postal_code) VALUES
((SELECT id FROM shared_therapists WHERE name='Dr. Felia Flieder'), 'Rosenstraße', '10', 'Berlin', '10110'),
((SELECT id FROM shared_therapists WHERE name='Dr. Hans Müller'), 'Berliner Straße', '12', 'Berlin', '10115'),
((SELECT id FROM shared_therapists WHERE name='Dr. Anna Schmidt'), 'Kaiserstraße', '34', 'Berlin', '10117'),
((SELECT id FROM shared_therapists WHERE name='Dr. Peter Fischer'), 'Friedrichstraße', '56', 'Berlin', '10119'),
((SELECT id FROM shared_therapists WHERE name='Dr. Julia Weber'), 'Leipziger Platz', '78', 'Berlin', '10121'),
((SELECT id FROM shared_therapists WHERE name='Dr. Michael Wagner'), 'Alexanderplatz', '90', 'Berlin', '10123'),
((SELECT id FROM shared_therapists WHERE name='Dr. Laura Becker'), 'Kurfürstendamm', '11', 'Berlin', '10125'),
((SELECT id FROM shared_therapists WHERE name='Dr. Thomas Hoffmann'), 'Müllerstraße', '22', 'Berlin', '10127'),
((SELECT id FROM shared_therapists WHERE name='Dr. Sandra Richter'), 'Wilmersdorfer Straße', '33', 'Berlin', '10129'),
((SELECT id FROM shared_therapists WHERE name='Dr. Markus Schulz'), 'Schönhauser Allee', '44', 'Berlin', '10131'),
((SELECT id FROM shared_therapists WHERE name='Dr. Claudia Bauer'), 'Frankfurter Allee', '55', 'Berlin', '10133'),
((SELECT id FROM shared_therapists WHERE name='Dr. Andreas Klein'), 'Karl-Marx-Straße', '66', 'Berlin', '10135'),
((SELECT id FROM shared_therapists WHERE name='Dr. Lena Wolf'), 'Mehringdamm', '77', 'Berlin', '10137'),
((SELECT id FROM shared_therapists WHERE name='Dr. Stefan Neumann'), 'Potsdamer Platz', '88', 'Berlin', '10139'),
((SELECT id FROM shared_therapists WHERE name='Dr. Birgit Schwarz'), 'Straße des 17. Juni', '99', 'Berlin', '10141'),
((SELECT id FROM shared_therapists WHERE name='Dr. Frank Meyer'), 'Unter den Linden', '101', 'Berlin', '10143'),
((SELECT id FROM shared_therapists WHERE name='Dr. Anja Zimmermann'), 'Tauentzienstraße', '202', 'Berlin', '10145'),
((SELECT id FROM shared_therapists WHERE name='Dr. Oliver Krüger'), 'Oranienstraße', '303', 'Berlin', '10147'),
((SELECT id FROM shared_therapists WHERE name='Dr. Katrin Hartmann'), 'Eberswalder Straße', '404', 'Berlin', '10149'),
((SELECT id FROM shared_therapists WHERE name='Dr. Christian Lange'), 'Greifswalder Straße', '505', 'Berlin', '10151'),
((SELECT id FROM shared_therapists WHERE name='Dr. Nina König'), 'Kollwitzstraße', '606', 'Berlin', '10153');
