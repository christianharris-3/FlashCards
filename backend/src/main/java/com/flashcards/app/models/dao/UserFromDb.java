package com.flashcards.app.models.dao;

import lombok.Data;

@Data
public class UserFromDb {
    private long userId;
    private long activeCollectionId;
    private String username;
    private String passwordHash;
}
