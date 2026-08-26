package com.flashcards.app.managers;

import com.flashcards.app.dao.LearningDao;
import com.flashcards.app.models.dao.FlashCard;
import com.flashcards.app.models.dao.FlashCardData;
import com.flashcards.app.models.dao.FlashCardInLearningInstance;
import com.flashcards.app.models.dao.LearningInstanceData;
import com.flashcards.app.models.enums.FrontOfCard;
import com.flashcards.app.models.enums.LearningType;

import java.sql.Timestamp;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

public class LearningManager {

    private final LearningDao learningDao;

    public LearningManager(LearningDao learningDao) {
        this.learningDao = learningDao;
    }

    public void logFlashCardUse(long flashCardId, String timestamp, Integer timeTakenMs, Integer userFeedback) {
        learningDao.logFlashCardUse(flashCardId, Timestamp.valueOf(timestamp), timeTakenMs, userFeedback);
    }

    public List<FlashCardInLearningInstance> getLearningInstanceCards(long learningInstanceId) {
        return learningDao.getLearningInstanceCards(learningInstanceId);
    }

    public int getLearningInstanceSize(long collectionId, String learningType) {
        LearningType type = LearningType.valueOf(learningType.toUpperCase(Locale.ROOT));
        boolean ignoreSeenToday = (type == LearningType.DAILY);
        return learningDao.getLearningInstanceSize(collectionId, ignoreSeenToday);
    }

    public long createLearningInstance(long collectionId, String learningType, String frontOfCardString, int startIndex, int endIndex) {

        LearningType type = LearningType.valueOf(learningType.toUpperCase(Locale.ROOT));
        int limit = endIndex - startIndex;

        long learningInstanceId = learningDao.createLearningInstance(collectionId, learningType, startIndex, endIndex);

        FrontOfCard frontOfCard = FrontOfCard.valueOf(frontOfCardString.toUpperCase(Locale.ROOT));
        boolean frontFirst = true;
        boolean randomizeFrontFirst = false;
        if (frontOfCard == FrontOfCard.BACK) {
            frontFirst = false;
        } else if (frontOfCard == FrontOfCard.RANDOM) {
            randomizeFrontFirst = true;
        }

        switch (type) {
            case DAILY -> learningDao.populateLearningInstanceDaily(
                    learningInstanceId,
                    collectionId,
                    frontFirst,
                    randomizeFrontFirst,
                    limit,
                    startIndex);
            case PRIORITY -> learningDao.populateLearningInstancePriority(
                    learningInstanceId,
                    collectionId,
                    frontFirst,
                    randomizeFrontFirst,
                    limit,
                    startIndex);
            case INORDER -> learningDao.populateLearningInstanceInOrder(
                    learningInstanceId,
                    collectionId,
                    frontFirst,
                    randomizeFrontFirst,
                    limit,
                    startIndex);
            case RANDOM -> learningDao.populateLearningInstanceRandom(
                    learningInstanceId,
                    collectionId,
                    frontFirst,
                    randomizeFrontFirst,
                    limit,
                    startIndex);
        }
        return learningInstanceId;
    }

    public Optional<LearningInstanceData> getLearningInstanceData(long learningInstanceId) {
        return learningDao.getLearningInstanceData(learningInstanceId);
    }
}
