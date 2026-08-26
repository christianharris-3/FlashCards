package com.flashcards.app.models.requests;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateLearningInstanceRequest {
    @NotNull
    private int startIndex = 0;
    @NotNull
    private int endIndex = 10000;
    @NotNull
    private String frontOfCard;
}
