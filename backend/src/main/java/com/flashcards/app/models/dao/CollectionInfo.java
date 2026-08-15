package com.flashcards.app.models.dao;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class CollectionInfo {
    private long collectionId;
    private String collectionName;
    private long itemCount;
}
