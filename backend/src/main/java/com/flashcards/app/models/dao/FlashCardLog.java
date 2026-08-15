package com.flashcards.app.models.dao;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class FlashCardLog {
    private long flashCardLogId;
    private long flashCardId;

    private Timestamp timestamp;
    private Integer userFeedback;
}
