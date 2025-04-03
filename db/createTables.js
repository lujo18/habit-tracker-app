export const SCHEMA_SQL = `--sql

  CREATE TABLE IF NOT EXISTS Habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    setting TEXT,
    repeat TEXT,
    label TEXT,
    limitType TEXT,
    referenceGoal INTEGER,
    color TEXT,
    location TEXT,
    currentStreak INTEGER,
    highestStreak INTEGER
  );

  CREATE TABLE IF NOT EXISTS HabitHistory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    habitId INTEGER NOT NULL,
    completionCount INTEGER,
    completed BIT DEFAULT 0 NOT NULL,
    goal INTEGER,
    date DATE,
    streak INTEGER,
    FOREIGN KEY (habitId) REFERENCES Habits(id)

    UNIQUE (habitId, date)
  );

  CREATE TABLE IF NOT EXISTS QuitHabits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    repeat TEXT DEFAULT "forever",
    startTime DATETIME NOT NULL,
    lastResetReason TEXT,
    currentDuration INTEGER DEFAULT 0,
    color TEXT
  );

  CREATE TABLE IF NOT EXISTS QuitHabitHistory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    habitId INTEGER NOT NULL,
    resetTime DATETIME NOT NULL,
    previousDuration INTEGER,
    reason TEXT,
    date DATE,
    FOREIGN KEY (habitId) REFERENCES QuitHabits(id)

    UNIQUE (habitId)
  );

  CREATE TABLE IF NOT EXISTS JournalEntries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    habitId INTEGER,
    title TEXT,
    body TEXT,
    
    FOREIGN KEY (habitId) REFERENCES Habits(id)
  
    UNIQUE (title)
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