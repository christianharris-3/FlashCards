package com.flashcards.app.managers;

import com.flashcards.app.dao.AuthDao;
import com.flashcards.app.dao.FlashCardDao;
import com.flashcards.app.exceptions.CollectionNotOwnedException;
import com.flashcards.app.models.User;
import com.flashcards.app.models.dao.FlashCard;

import java.util.List;
import java.util.Optional;

public class UserValidationManager {

    private final AuthDao authDao;
    private final FlashCardDao flashCardDao;

    public UserValidationManager(AuthDao authDao, FlashCardDao flashCardDao) {
        this.authDao = authDao;
        this.flashCardDao = flashCardDao;
    }

    public void validateUserHasCollection(User user, long collectionId) throws CollectionNotOwnedException {
        List<Long> collectionIds = authDao.getUserCollections(user.getUserId());
        if (!collectionIds.contains(collectionId)) {
            throw new CollectionNotOwnedException();
        }
    }

    public void validateUserHasFlashCard(User user, long flashCardId) throws CollectionNotOwnedException {
        Optional<FlashCard> flashCard = flashCardDao.getFlashCard(flashCardId);
        if (flashCard.isEmpty()) {
            throw new CollectionNotOwnedException();
        }
        validateUserHasCollection(user, flashCard.get().getCollectionId());
    }

    public void validateUserHasLearningInstance(User user, long learningInstanceId) throws CollectionNotOwnedException {
        Optional<Long> userId = authDao.getLearningInstanceUserId(learningInstanceId);
        if (userId.isEmpty() || userId.get() != user.getUserId()) {
            throw new CollectionNotOwnedException();
        }
    }
}
