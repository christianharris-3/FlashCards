package com.flashcards.app.managers;

import com.flashcards.app.dao.LearningDao;
import com.flashcards.app.models.dao.FlashCard;
import com.flashcards.app.models.dao.FlashCardData;
import com.flashcards.app.models.dao.FlashCardInLearningInstance;

import java.sql.Timestamp;
import java.util.List;

public class LearningManager {

    private final LearningDao learningDao;

    public LearningManager(LearningDao learningDao) {
        this.learningDao = learningDao;
    }

    public void addFlashCardLog(long flashCardId, String timestamp, Integer timeTakenMs, Integer userFeedback) {
        learningDao.addFlashCardLog(flashCardId, Timestamp.valueOf(timestamp), timeTakenMs, userFeedback);
    }

    public List<FlashCardInLearningInstance> getLearningInstanceCards(long learningInstanceId) {
        return learningDao.getLearningInstanceCards(learningInstanceId);
    }

    public long createLearningInstanceDaily(long collectionId, int startIndex, int endIndex) {
        long learningInstanceId = learningDao.createLearningInstance(collectionId);
        learningDao.populateLearningInstanceDaily(learningInstanceId,
                collectionId,
                endIndex - startIndex,
                startIndex);
        return learningInstanceId;
    }

    public long createLearningInstancePriority(long collectionId, int startIndex, int endIndex) {
        long learningInstanceId = learningDao.createLearningInstance(collectionId);
        learningDao.populateLearningInstancePriority(learningInstanceId,
                collectionId,
                endIndex - startIndex,
                startIndex);
        return learningInstanceId;
    }

    public long createLearningInstanceInOrder(long collectionId, int startIndex, int endIndex) {
        long learningInstanceId = learningDao.createLearningInstance(collectionId);
        learningDao.populateLearningInstanceInOrder(learningInstanceId,
                collectionId,
                endIndex - startIndex,
                startIndex);
        return learningInstanceId;
    }

    public long createLearningInstanceRandom(long collectionId, int startIndex, int endIndex) {
        long learningInstanceId = learningDao.createLearningInstance(collectionId);
        learningDao.populateLearningInstanceRandom(learningInstanceId,
                collectionId,
                endIndex - startIndex,
                startIndex);
        return learningInstanceId;
    }
}
