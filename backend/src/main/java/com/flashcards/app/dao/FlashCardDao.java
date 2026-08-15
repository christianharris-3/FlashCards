package com.flashcards.app.dao;

import com.flashcards.app.models.dao.FlashCard;
import com.flashcards.app.models.dao.FlashCardLog;
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
                    frontText,
                    backText
                ) VALUES (
                    :collectionId,
                    :frontText,
                    :backText
                );
            """)
    void createFlashCard(
            @Bind("collectionId") long collectionId,
            @Bind("frontText") String frontText,
            @Bind("backText") String backText
    );

    @RegisterBeanMapper(FlashCard.class)
    @SqlQuery("""
            SELECT flashCardId, collectionId, frontText, backText
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
    List<FlashCardLog> getFlashCardLogs(@Bind("flashCardId") long flashCardId);

    @RegisterBeanMapper(FlashCard.class)
    @SqlQuery("""
            SELECT flashCardId, collectionId, frontText, backText
            FROM FlashCard
            WHERE (collectionId = :collectionId);
            """)
    List<FlashCard> getFlashCards(@Bind("collectionId") long collectionId);

    @SqlUpdate("""
            UPDATE FlashCard
            SET frontText = COALESCE(:frontText, frontText),
                backText = COALESCE(:backText, backText)
            WHERE (flashCardId = :flashCardId);
            """)
    void updateFlashCard(@Bind("flashCardId") long flashCardId,
                          @Bind("frontText") String frontText,
                          @Bind("backText") String backText);


    @SqlUpdate("""
            DELETE FROM FlashCard
            WHERE (flashCardId = :flashCardId);
            """)
    void deleteFlashCard(@Bind("flashCardId") long flashCardId);

}
