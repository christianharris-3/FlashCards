package com.flashcards.app.models.requests;

import jakarta.validation.Valid;
import lombok.Data;

@Data
public class CreateCollectionRequest {
    @Valid
    private String collectionName;
}
