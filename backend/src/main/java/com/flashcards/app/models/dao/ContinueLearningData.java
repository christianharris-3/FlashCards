package com.flashcards.app.models.dao;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class ContinueLearningData {
    private long collectionId;
    private String collectionName;
    private long learningInstanceId;
    private Timestamp startedTimestamp;
    private String learningType;
    private int totalCards;
    private int cardsDone;
}
