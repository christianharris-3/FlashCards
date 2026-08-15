package com.flashcards.app.models.response;

import com.flashcards.app.models.dao.FlashCard;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CollectionData {
    private long collectionId;
    private String collectionName;
    private long itemCount;
    private List<FlashCard> flashCards;
}
