
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS UserRole;
DROP TABLE IF EXISTS Collection;
DROP TABLE IF EXISTS FlashCard;
DROP TABLE IF EXISTS FlashCardUse;
DROP TABLE IF EXISTS LearningInstance;
DROP VIEW IF EXISTS FlashCardsWithPriority;


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
    collectionPosition INT NOT NULL,
    frontText VARCHAR(1024) NOT NULL,
    backText VARCHAR(1024) NOT NULL
);

CREATE TABLE FlashCardUse(
    flashCardUseId BIGINT PRIMARY KEY AUTO_INCREMENT,
    flashCardId BIGINT NOT NULL,
    learningInstanceId BIGINT NOT NULL,
    learningInstancePosition INT NOT NULL,
    complete BOOLEAN NOT NULL,
    timestamp TIMESTAMP,
    timeTakenMs INT,
    userFeedback INT
);

CREATE TABLE LearningInstance(
    learningInstanceId BIGINT PRIMARY KEY AUTO_INCREMENT,
    collectionId BIGINT NOT NULL,
    startedTimestamp TIMESTAMP,
    endTimestamp TIMESTAMP
);

CREATE VIEW FlashCardsWithPriority AS SELECT
        FlashCard.flashCardId as flashCardId,
        FlashCard.collectionId as collectionId,
        FlashCard.collectionPosition as collectionPosition,
        FlashCard.frontText as frontText,
        FlashCard.backText as backText,
        COALESCE(SUM(FlashCardUse.userFeedback), 0) as priority,
        COALESCE(MAX(DATE(FlashCardUse.timestamp)) = CURDATE(), false) as seenToday
    FROM FlashCard LEFT JOIN FlashCardUse
    ON FlashCard.flashCardId = FlashCardUse.flashCardId AND NOT FlashCardUse.complete
    GROUP BY flashCardId;