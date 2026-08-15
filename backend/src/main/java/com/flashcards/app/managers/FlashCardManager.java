package com.flashcards.app.managers;

import com.flashcards.app.dao.FlashCardDao;
import com.flashcards.app.models.dao.FlashCard;
import com.flashcards.app.models.dao.FlashCardHistory;
import com.flashcards.app.models.dao.FlashCardLog;

import java.util.List;
import java.util.Optional;

public class FlashCardManager {

    private final FlashCardDao flashCardDao;

    public FlashCardManager(FlashCardDao flashCardDao) {
        this.flashCardDao = flashCardDao;
    }

    public void createFlashCard(long collectionId, String frontText, String backText) {
        flashCardDao.createFlashCard(collectionId, frontText, backText);
    }

    public Optional<FlashCardHistory> getFlashCardHistory(long flashCardId) {
        Optional<FlashCard> flashCard = flashCardDao.getFlashCard(flashCardId);
        if (flashCard.isPresent()) {
            List<FlashCardLog> logs = flashCardDao.getFlashCardLogs(flashCardId);
            return Optional.of(
                    new FlashCardHistory(
                            flashCard.get().getFlashCardId(),
                            flashCard.get().getCollectionId(),
                            flashCard.get().getFrontText(),
                            flashCard.get().getBackText(),
                            logs
                    )
            );
        }
        return Optional.empty();
    }

    public void updateFlashCard(long flashCardId, String frontText, String backText) {
        flashCardDao.updateFlashCard(flashCardId, frontText, backText);
    }

    public void deleteFlashCard(long flashCardId) {
        flashCardDao.deleteFlashCard(flashCardId);
    }
}
