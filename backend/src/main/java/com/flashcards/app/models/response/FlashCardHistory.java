package com.flashcards.app.models.dao;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class FlashCardHistory {
    private long flashCardId;
    private long collectionId;
    private int collectionPosition;
    private String frontText;
    private String backText;
    private List<FlashCardLog> logs;
}
