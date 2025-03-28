const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db'); // Use a file-based database

db.serialize(() => {
  // Create the 'users' table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      password TEXT,
      name TEXT
    )
  `);

  // Create the 'tutors' table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS tutors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      qualifications TEXT DEFAULT '',
      hourlyRate TEXT DEFAULT ''
    )
  `);


  // Insert initial data into 'tutors' table if it's empty
  const insertData = `
    INSERT INTO tutors (name, email, password, qualifications, hourlyRate) VALUES
    ('Luca Moretti', 'luca.moretti@example.com', 'password123', 'PhD in Computer Science', '120'),
    ('Sofia Pérez', 'sofia.perez@example.com', 'password123', 'MA in Philosophy', '110'),
    ('Aleksei Ivanov', 'aleksei.ivanov@example.com', 'password123', 'PhD in Engineering', '150'),
    ('Isabella Müller', 'isabella.mueller@example.com', 'password123', 'MA in Literature', '130'),
    ('Pierre Dubois', 'pierre.dubois@example.com', 'password123', 'MSc in Mathematics', '140'),
    ('Olga Kuznetsova', 'olga.kuznetsova@example.com', 'password123', 'PhD in Physics', '160'),
    ('José Martínez', 'jose.martinez@example.com', 'password123', 'MA in History', '100'),
    ('Hiroshi Tanaka', 'hiroshi.tanaka@example.com', 'password123', 'MSc in Chemistry', '110'),
    ('Marina Rossi', 'marina.rossi@example.com', 'password123', 'PhD in Biology', '125'),
    ('Andrés Gómez', 'andres.gomez@example.com', 'password123', 'MA in Economics', '115'),
    ('Anya Petrovna', 'anya.petrovna@example.com', 'password123', 'PhD in Linguistics', '145'),
    ('Clara Schmidt', 'clara.schmidt@example.com', 'password123', 'MSc in Architecture', '135'),
    ('Felipe Silva', 'felipe.silva@example.com', 'password123', 'PhD in Chemistry', '140'),
    ('Daria Sokolova', 'daria.sokolova@example.com', 'password123', 'MA in Psychology', '120'),
    ('Liam O’Connor', 'liam.oconnor@example.com', 'password123', 'MA in Sociology', '100'),
    ('Nadia Hassan', 'nadia.hassan@example.com', 'password123', 'MSc in Physics', '130'),
    ('Giovanni Ricci', 'giovanni.ricci@example.com', 'password123', 'PhD in Engineering', '150'),
    ('Olivia Jensen', 'olivia.jensen@example.com', 'password123', 'MA in History', '110'),
    ('Viktor Kuznetsov', 'viktor.kuznetsov@example.com', 'password123', 'PhD in Philosophy', '160'),
    ('Carlos Fernández', 'carlos.fernandez@example.com', 'password123', 'MSc in Statistics', '125'),
    ('Eva Novak', 'eva.novak@example.com', 'password123', 'MA in Linguistics', '130'),
    ('Mateusz Nowak', 'mateusz.nowak@example.com', 'password123', 'PhD in Mathematics', '140'),
    ('Leila Badr', 'leila.badr@example.com', 'password123', 'MA in Sociology', '115'),
    ('Tarek Abdelrahman', 'tarek.abdelrahman@example.com', 'password123', 'PhD in Computer Science', '145'),
    ('Freja Hansen', 'freja.hansen@example.com', 'password123', 'MSc in Philosophy', '130'),
    ('Ivan Volkov', 'ivan.volkov@example.com', 'password123', 'MA in Economics', '110'),
    ('Lena Fischer', 'lena.fischer@example.com', 'password123', 'PhD in Psychology', '150'),
    ('Marta Kowalska', 'marta.kowalska@example.com', 'password123', 'MSc in Engineering', '120'),
    ('Paolo Bianchi', 'paolo.bianchi@example.com', 'password123', 'MA in Chemistry', '135'),
    ('Zara Ali', 'zara.ali@example.com', 'password123', 'MSc in Economics', '110'),
    ('Katerina Petrov', 'katerina.petrov@example.com', 'password123', 'PhD in History', '140'),
    ('Alexandra Nguyen', 'alexandra.nguyen@example.com', 'password123', 'MA in Mathematics', '130'),
    ('Samuel Ruiz', 'samuel.ruiz@example.com', 'password123', 'PhD in Computer Science', '150'),
    ('Maria Ruiz', 'maria.ruiz@example.com', 'password123', 'MA in Philosophy', '120'),
    ('Sergei Orlov', 'sergei.orlov@example.com', 'password123', 'PhD in Physics', '145'),
    ('Anastasia Mikhailova', 'anastasia.mikhailova@example.com', 'password123', 'MSc in Architecture', '130'),
    ('Diego Martínez', 'diego.martinez@example.com', 'password123', 'PhD in Economics', '140'),
    ('Karim El-Khater', 'karim.elkhater@example.com', 'password123', 'MA in Engineering', '125'),
    ('Maya Abadi', 'maya.abadi@example.com', 'password123', 'MSc in Psychology', '110'),
    ('Julian García', 'julian.garcia@example.com', 'password123', 'PhD in History', '130'),
    ('Sofia Costa', 'sofia.costa@example.com', 'password123', 'MSc in Philosophy', '120'),
    ('Rafael Pereira', 'rafael.pereira@example.com', 'password123', 'PhD in Computer Science', '145'),
    ('Chloe Dupont', 'chloe.dupont@example.com', 'password123', 'MA in Physics', '100'),
    ('Boris Alexandrov', 'boris.alexandrov@example.com', 'password123', 'MSc in Biology', '125'),
    ('Lucia Romero', 'lucia.romero@example.com', 'password123', 'MA in History', '110'),
    ('Leandro Silva', 'leandro.silva@example.com', 'password123', 'PhD in Mathematics', '130'),
    ('Claudia Ortega', 'claudia.ortega@example.com', 'password123', 'MSc in Chemistry', '140'),
    ('Maxim Ivanov', 'maxim.ivanov@example.com', 'password123', 'PhD in Psychology', '150'),
    ('Daniela Costa', 'daniela.costa@example.com', 'password123', 'MA in Sociology', '115'),
    ('Anita Szabo', 'anita.szabo@example.com', 'password123', 'MSc in Linguistics', '120'),
    ('Omar Khayyam', 'omar.khayyam@example.com', 'password123', 'PhD in Engineering', '130'),
    ('Yulia Makarova', 'yulia.makarova@example.com', 'password123', 'MA in Chemistry', '125'),
    ('Ricardo López', 'ricardo.lopez@example.com', 'password123', 'PhD in Physics', '135');
  `;

  db.get("SELECT COUNT(*) AS count FROM tutors", (err, row) => {
    if (err) {
      console.error('Error checking tutors table:', err);
    } else if (row.count === 0) {
      db.run(insertData, (err) => {
        if (err) {
          console.error('Error inserting data:', err.message);
        } else {
          console.log('Tutors data inserted successfully.');
        }
      });
    }
  });
});

module.exports = db;