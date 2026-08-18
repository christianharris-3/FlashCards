package com.flashcards.app.models.dao;

import lombok.Data;

@Data
public class FlashCardUserValidation {
    private long userId;
    private boolean complete;
}
