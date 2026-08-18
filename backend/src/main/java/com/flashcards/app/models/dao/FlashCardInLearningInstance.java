package com.flashcards.app.models.dao;

import lombok.Data;

@Data
public class FlashCardInLearningInstance {
    private long flashCardId;
    private long flashCardUseId;
    private long collectionId;
    private long learningInstanceId;
    private int positionIndex;
    private String frontText;
    private String backText;
    private boolean complete;
}
