package com.flashcards.app.models.requests;

import lombok.Data;

@Data
public class UpdateFlashCardRequest {
    private Integer collectionPosition;
    private String frontText;
    private String backText;
}
