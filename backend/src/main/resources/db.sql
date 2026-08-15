
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS UserRole;
DROP TABLE IF EXISTS Collection;
DROP TABLE IF EXISTS FlashCard;
DROP TABLE IF EXISTS FlashCardLog;


CREATE TABLE Users(
    userId BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    activeCollectionId BIGINT
);

CREATE TABLE UserRole(
    userId BIGINT,
    role VARCHAR(255),
    PRIMARY KEY (userId, role)
);

CREATE TABLE Collection(
    collectionId BIGINT PRIMARY KEY AUTO_INCREMENT,
    collectionName VARCHAR(255),
    userId BIGINT NOT NULL
);

CREATE TABLE FlashCard(
    flashCardId BIGINT PRIMARY KEY AUTO_INCREMENT,
    collectionId BIGINT NOT NULL,

    frontText VARCHAR(1024) NOT NULL,
    backText VARCHAR(1024) NOT NULL
);

CREATE TABLE FlashCardLog(
    flashCardLogId BIGINT NOT NULL,
    flashCardId BIGINT NOT NULL,

    timestamp TIMESTAMP NOT NULL,
    userFeedback INT
);
