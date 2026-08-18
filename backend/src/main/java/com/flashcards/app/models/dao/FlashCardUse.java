package com.flashcards.app.models.dao;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class FlashCardUse {
    private long flashCardUseId;
    private long flashCardId;
    private long learningInstanceId;
    private int learningInstancePosition;
    private boolean complete;
    private Timestamp timestamp;
    private Integer timeTakenMs;
    private Integer userFeedback;
}
