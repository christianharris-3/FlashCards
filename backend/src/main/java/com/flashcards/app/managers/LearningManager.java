package com.flashcards.app.managers;

import com.flashcards.app.dao.LearningDao;
import com.flashcards.app.models.dao.FlashCard;
import com.flashcards.app.models.dao.FlashCardData;

import java.sql.Timestamp;
import java.util.List;

public class LearningManager {

    private final LearningDao learningDao;

    public LearningManager(LearningDao learningDao) {
        this.learningDao = learningDao;
    }

    public void addFlashCardLog(long flashCardId, Timestamp timestamp, Integer timeTakenMs, Integer userFeedback) {
        learningDao.addFlashCardLog(flashCardId, timestamp, timeTakenMs, userFeedback);
    }

    public List<FlashCardData> getFlashCardsWithPriority(long collectionId) {
        return learningDao.getFlashCardsWithPriority(collectionId);
    }
}
