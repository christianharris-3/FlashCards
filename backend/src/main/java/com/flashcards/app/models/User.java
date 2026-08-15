package com.flashcards.app.models;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.security.Principal;
import java.util.Set;

@Data
@AllArgsConstructor
public class User implements Principal {
    private long userId;
    private long activeCollectionId;
    private String username;
    private Set<String> roles;

    public String getName() {
        return username;
    }
}
