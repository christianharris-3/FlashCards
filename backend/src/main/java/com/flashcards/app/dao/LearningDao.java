package com.flashcards.app.dao;

import com.flashcards.app.models.dao.FlashCardData;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

import java.sql.Timestamp;
import java.util.List;

public interface LearningDao {
    @SqlUpdate("""
            INSERT INTO FlashCardLog (
                flashCardId,
                timestamp,
                timeTakenMs,
                userFeedback
            ) VALUES (
                :flashCardId,
                :timestamp,
                :timeTakenMs,
                :userFeedback
            );
            """)
    void addFlashCardLog(@Bind("flashCardId") long flashCardId,
                         @Bind("timestamp") Timestamp timestamp,
                         @Bind("timeTakenMs") Integer timeTakenMs,
                         @Bind("userFeedback") Integer userFeedback);

    @RegisterBeanMapper(FlashCardData.class)
    @SqlQuery("""
            With mainData AS (
                SELECT
                    FlashCard.flashCardId as flashCardId,
                    FlashCard.collectionId as collectionId,
                    FlashCard.collectionPosition as collectionPosition,
                    FlashCard.frontText as frontText,
                    FlashCard.backText as backText,
                    COALESCE(SUM(FlashCardLog.userFeedback), 0) as priority,
                    COALESCE(MAX(DATE(FlashCardLog.timestamp)) = CURDATE(), false) as seenToday
                FROM FlashCard LEFT JOIN FlashCardLog
                ON FlashCard.flashCardId = FlashCardLog.flashCardId
                WHERE FlashCard.collectionId = :collectionId
                GROUP BY flashCardId
                ORDER BY seenToday ASC, priority ASC
            )
            SELECT * FROM mainData WHERE NOT seenToday;
            """)
    List<FlashCardData> getFlashCardsWithPriority(@Bind("collectionId") long collectionId);

}
