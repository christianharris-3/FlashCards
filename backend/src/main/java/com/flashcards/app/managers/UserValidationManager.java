package com.flashcards.app.managers;

import com.flashcards.app.dao.AuthDao;
import com.flashcards.app.exceptions.CollectionNotOwnedException;
import com.flashcards.app.models.User;

import java.util.List;
import java.util.Optional;

public class UserValidationManager {

    private final AuthDao authDao;

    public UserValidationManager(AuthDao authDao) {
        this.authDao = authDao;
    }

    public void validateUserHasCollection(User user, long collectionId) throws CollectionNotOwnedException {
        List<Long> collectionIds = authDao.getUserCollections(user.getUserId());
        if (!collectionIds.contains(collectionId)) {
            throw new CollectionNotOwnedException();
        }
    }
}
