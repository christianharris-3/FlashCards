package com.flashcards.app.models.requests;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateFlashCardRequest {
    @NotNull
    private long collectionId;
    private String frontText;
    private String backText;
}
