
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)

CREATE TABLE IF NOT EXISTS Article (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(100) NOT NULL,
    subtitle VARCHAR(200) NULL,
    body TEXT NOT NULL,
    created DATETIME NOT NULL,
    modified DATETIME NULL,
    published DATETIME NULL
);

CREATE TABLE IF NOT EXISTS Reaction (
    articleId INT NOT NULL,
    userSession GUID NOT NULL,
    PRIMARY KEY (articleId, userSession),
    FOREIGN KEY (articleId) REFERENCES Article(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Comment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    articleId INT NOT NULL,
    body TEXT NOT NULL,
    created DATETIME NOT NULL,
    FOREIGN KEY (articleId) REFERENCES Article(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Settings (
    id VARCHAR(10) NOT NULL PRIMARY KEY,
    value VARCHAR(100) NOT NULL
);

--insert default data (if necessary here)

INSERT INTO Settings VALUES
("title", "Blogging tool"),
("subtitle", "Simple blogging tool for the mid-term of CM2040"),
("author", "Rodrigo Chin");


COMMIT;
