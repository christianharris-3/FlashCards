package com.flashcards.app.managers;

import com.flashcards.app.dao.FlashCardDao;
import com.flashcards.app.models.dao.FlashCard;
import com.flashcards.app.models.dao.FlashCardHistory;
import com.flashcards.app.models.dao.FlashCardUse;

import java.util.List;
import java.util.Optional;

public class FlashCardManager {

    private final FlashCardDao flashCardDao;

    public FlashCardManager(FlashCardDao flashCardDao) {
        this.flashCardDao = flashCardDao;
    }

    public void createFlashCard(long collectionId, String frontText, String backText) {
        flashCardDao.createFlashCard(collectionId,
                flashCardDao.getMaxFlashCountPosition(collectionId) + 1,
                frontText,
                backText);
    }

    public Optional<FlashCardHistory> getFlashCardHistory(long flashCardId) {
        Optional<FlashCard> flashCard = flashCardDao.getFlashCard(flashCardId);
        if (flashCard.isPresent()) {
            List<FlashCardUse> logs = flashCardDao.getFlashCardLogs(flashCardId);
            return Optional.of(
                    new FlashCardHistory(
                            flashCard.get().getFlashCardId(),
                            flashCard.get().getCollectionId(),
                            flashCard.get().getCollectionPosition(),
                            flashCard.get().getFrontText(),
                            flashCard.get().getBackText(),
                            logs
                    )
            );
        }
        return Optional.empty();
    }

    public void updateFlashCard(long flashCardId, Integer collectionPosition, String frontText, String backText) {
        flashCardDao.updateFlashCard(flashCardId, collectionPosition, frontText, backText);
        if (collectionPosition == null) {
            reCalculateCollectionPositions(flashCardId);
        } else {
            reCalculateCollectionPositions(flashCardId, collectionPosition);
        }
    }

    public void deleteFlashCard(long flashCardId) {
        flashCardDao.deleteFlashCard(flashCardId);
        reCalculateCollectionPositions(flashCardId);
    }

    private void reCalculateCollectionPositions(long flashCardId) {
        reCalculateCollectionPositions(flashCardId, -1);
    }
    private void reCalculateCollectionPositions(long flashCardId, long fixedFlashCardId) {
        Optional<FlashCard> flashCard = flashCardDao.getFlashCard(flashCardId);
        flashCard.ifPresent(card -> flashCardDao.reCalculateCollectionPositions(card.getCollectionId(),
                fixedFlashCardId));
    }
}
