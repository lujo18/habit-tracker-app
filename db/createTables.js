export const SCHEMA_SQL = `--sql

  CREATE TABLE IF NOT EXISTS Habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    setting TEXT,
    repeat TEXT,
    label TEXT,
    limitType TEXT,
    referenceGoal INTEGER,
    color TEXT
  );


  CREATE TABLE IF NOT EXISTS HabitHistory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    habitId INTEGER NOT NULL,
    completion INTEGER,
    goal INTEGER,
    date DATE UNIQUE,
    FOREIGN KEY (habitId) REFERENCES Habits(id)
  );

  CREATE TABLE IF NOT EXISTS HabitLabel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  );
  
  CREATE TABLE IF NOT EXISTS HabitLocation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  );
  
  
  INSERT OR IGNORE INTO HabitLabel (name)
  VALUES
  ("minutes"),
  ("hours"),
  ("pages");

  INSERT OR IGNORE INTO HabitLocation (name)
  VALUES
  ("home"),
  ("bedroom"),
  ("kitchen");

`