package com.flashcards.app.models.dao;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class LearningInstanceData {
    private int cardsDone;
    private int totalCards;
    private Timestamp startTime;
    private Timestamp endTime;
    private int totalTimeTakenMs;
    private int totalGood;
    private int totalOkay;
    private int totalBad;
}
