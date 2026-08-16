package com.flashcards.app.models.requests;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class AddFlashCardLogRequest {
    private Timestamp timestamp;
    private Integer timeTakenMs;
    private Integer userFeedback;
}
