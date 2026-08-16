package com.flashcards.app.models.dao;

import lombok.Data;

@Data
public class FlashCardData {
    private long flashCardId;
    private long collectionId;
    private int collectionPosition;
    private String frontText;
    private String backText;
    private Float priority;
    private Boolean seenToday;

}
