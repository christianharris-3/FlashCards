package com.flashcards.app.models.requests;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class AddFlashCardLogRequest {
    @NotNull
    private String timestamp;
    private Integer timeTakenMs;
    @NotNull
    private Integer userFeedback;
}
