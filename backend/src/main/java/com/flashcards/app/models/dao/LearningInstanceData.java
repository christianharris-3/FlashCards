package com.flashcards.app.models.dao;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class LearningInstanceData {
    private String collectionName;
    private String learningType;
    private int collectionStartIndex;
    private int collectionEndIndex;
    private int cardsDone;
    private int totalCards;
    private Timestamp startTime;
    private Timestamp endTime;
    private int totalTimeTakenMs;
    private int totalGood;
    private int totalOkay;
    private int totalBad;
}
