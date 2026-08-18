package com.flashcards.app.dao;

import com.flashcards.app.models.dao.FlashCard;
import com.flashcards.app.models.dao.FlashCardUse;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

import java.util.List;
import java.util.Optional;

public interface FlashCardDao {

    @SqlUpdate("""
                INSERT INTO FlashCard (
                    collectionId,
                    collectionPosition,
                    frontText,
                    backText
                ) VALUES (
                    :collectionId,
                    :collectionPosition,
                    :frontText,
                    :backText
                );
            """)
    void createFlashCard(
            @Bind("collectionId") long collectionId,
            @Bind("collectionPosition") int collectionPosition,
            @Bind("frontText") String frontText,
            @Bind("backText") String backText
    );

    @RegisterBeanMapper(FlashCard.class)
    @SqlQuery("""
            SELECT flashCardId, collectionId, collectionPosition, frontText, backText
            FROM FlashCard
            WHERE (flashCardId = :flashCardId);
            """)
    Optional<FlashCard> getFlashCard(@Bind("flashCardId") long flashCardId);

    @RegisterBeanMapper(FlashCard.class)
    @SqlQuery("""
            SELECT flashCardLogId, flashCardId, timestamp, userFeedback
            FROM FlashCardLog
            WHERE (flashCardId = :flashCardId);
            """)
    List<FlashCardUse> getFlashCardLogs(@Bind("flashCardId") long flashCardId);

    @RegisterBeanMapper(FlashCard.class)
    @SqlQuery("""
            SELECT flashCardId, collectionId, collectionPosition, frontText, backText
            FROM FlashCard
            WHERE (collectionId = :collectionId)
            ORDER BY collectionPosition ASC;
            """)
    List<FlashCard> getFlashCards(@Bind("collectionId") long collectionId);

    @SqlUpdate("""
            UPDATE FlashCard
            SET collectionPosition = COALESCE(:collectionPosition, collectionPosition),
                frontText = COALESCE(:frontText, frontText),
                backText = COALESCE(:backText, backText)
            WHERE (flashCardId = :flashCardId);
            """)
    void updateFlashCard(@Bind("flashCardId") long flashCardId,
                         @Bind("collectionPosition") Integer collectionPosition,
                         @Bind("frontText") String frontText,
                         @Bind("backText") String backText);


    @SqlUpdate("""
            DELETE FROM FlashCard
            WHERE (flashCardId = :flashCardId);
            """)
    void deleteFlashCard(@Bind("flashCardId") long flashCardId);

    @SqlQuery("""
            SELECT MAX(collectionPosition)
            FROM FlashCard
            WHERE (collectionId = :collectionId);
            """)
    int getMaxFlashCountPosition(@Bind("collectionId") long collectionId);

    @SqlUpdate("""
            WITH FlashCardsWithFixed AS (
                SELECT flashCardId, collectionPosition, (flashCardId = :fixedFlashCardId) AS isFixed
                FROM FlashCard WHERE (collectionId = :collectionId)
            ), ReorderData AS (
                SELECT flashCardId, ROW_NUMBER() OVER (ORDER BY collectionPosition ASC, isFixed ASC) AS newCollectionPosition
                FROM FlashCardsWithFixed
            )
            UPDATE FlashCard original
            JOIN ReorderData new
            ON original.flashCardId = new.flashCardId
            SET original.collectionPosition = new.newCollectionPosition;
            """)
    void reCalculateCollectionPositions(@Bind("collectionId") long collectionId,
                                        @Bind("fixedFlashCardId") long fixedFlashCardId);
}
