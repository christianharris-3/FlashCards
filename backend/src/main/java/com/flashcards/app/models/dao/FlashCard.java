package com.flashcards.app.models.dao;

import lombok.Data;

@Data
public class FlashCard {
    private long flashCardId;
    private long collectionId;
    private int collectionPosition;
    private String frontText;
    private String backText;
}
