package com.flashcards.app.dao;

import com.flashcards.app.models.dao.FlashCard;
import com.flashcards.app.models.dao.FlashCardData;
import com.flashcards.app.models.dao.FlashCardInLearningInstance;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.statement.GetGeneratedKeys;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

import java.sql.Timestamp;
import java.util.List;

public interface LearningDao {

    @GetGeneratedKeys
    @SqlUpdate("""
            INSERT INTO LearningInstance (
                collectionId,
                startedTimestamp
            ) VALUES (
                :collectionId,
                NOW()
            );
            """)
    long createLearningInstance(@Bind("collectionId") long collectionId);

    @RegisterBeanMapper(FlashCardInLearningInstance.class)
    @SqlQuery("""
            SELECT
                FlashCardUse.flashCardId as flashCardId,
                FlashCardUse.flashCardUseId as flashCardUseId,
                FlashCard.collectionId as collectionId,
                FlashCardUse.learningInstanceId as learningInstanceId,
                FlashCardUse.learningInstancePosition as positionIndex,
                FlashCard.frontText as frontText,
                FlashCard.backText as backText
            FROM FlashCardUse LEFT JOIN FlashCard
            ON FlashCardUse.flashCardId = FlashCard.flashCardId
            WHERE FlashCardUse.learningInstanceId = :learningInstanceId
            ORDER BY FlashCardUse.learningInstancePosition;
            """)
    List<FlashCardInLearningInstance> getLearningInstanceCards(@Bind("learningInstanceId") long learningInstanceId);

    @SqlUpdate("""
            INSERT INTO FlashCardUse (
                flashCardId, learningInstanceId, learningInstancePosition, complete
            )
            SELECT flashCardId, learningInstanceId, ROW_NUMBER() OVER (ORDER BY priority), false
            FROM FlashCardsWithPriority
            WHERE collectionID = :collectionId AND NOT FlashCardsWithPriority.seenToday
            LIMIT :limit OFFSET :offset;
            """)
    void populateLearningInstanceDaily(@Bind("learningInstanceId") long learningInstanceId,
                                        @Bind("collectionId") long collectionId,
                                        @Bind("limit") int limit,
                                        @Bind("offset") int offset);

    @SqlUpdate("""
            INSERT INTO FlashCardUse (
                flashCardId, learningInstanceId, learningInstancePosition, complete
            )
            SELECT flashCardId, :learningInstanceId, ROW_NUMBER() OVER (ORDER BY priority), false
            FROM FlashCardsWithPriority
            WHERE collectionId = :collectionId
            LIMIT :limit OFFSET :offset;
            """)
    void populateLearningInstancePriority(@Bind("learningInstanceId") long learningInstanceId,
                                          @Bind("collectionId") long collectionId,
                                          @Bind("limit") int limit,
                                          @Bind("offset") int offset);

    @SqlUpdate("""
            INSERT INTO FlashCardUse (
                flashCardId, learningInstanceId, learningInstancePosition, complete
            )
            SELECT flashCardId, :learningInstanceId, ROW_NUMBER() OVER (ORDER BY collectionPosition), false
            FROM FlashCardsWithPriority
            WHERE collectionID = :collectionId
            LIMIT :limit OFFSET :offset;
            """)
    void populateLearningInstanceInOrder(@Bind("learningInstanceId") long learningInstanceId,
                                        @Bind("collectionId") long collectionId,
                                        @Bind("limit") int limit,
                                        @Bind("offset") int offset);

    @SqlUpdate("""
            INSERT INTO FlashCardUse (
                flashCardId, learningInstanceId, learningInstancePosition, complete
            )
            SELECT flashCardId, :learningInstanceId, ROW_NUMBER() OVER (ORDER BY RAND()), false
            FROM FlashCardsWithPriority
            WHERE collectionID = :collectionId
            LIMIT :limit OFFSET :offset;
            """)
    void populateLearningInstanceRandom(@Bind("learningInstanceId") long learningInstanceId,
                                        @Bind("collectionId") long collectionId,
                                        @Bind("limit") int limit,
                                        @Bind("offset") int offset);

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
}
