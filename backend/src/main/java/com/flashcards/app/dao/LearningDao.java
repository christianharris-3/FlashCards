package com.flashcards.app.dao;

import com.flashcards.app.models.dao.ContinueLearningData;
import com.flashcards.app.models.dao.FlashCardInLearningInstance;
import com.flashcards.app.models.dao.LearningInstanceData;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.statement.GetGeneratedKeys;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

public interface LearningDao {

    @GetGeneratedKeys
    @SqlUpdate("""
            INSERT INTO LearningInstance (
                collectionId,
                startedTimestamp,
                complete,
                learningType,
                collectionStartIndex,
                collectionEndIndex
            ) VALUES (
                :collectionId,
                NOW(),
                false,
                :learningType,
                :collectionStartIndex,
                :collectionEndIndex
            );
            """)
    long createLearningInstance(@Bind("collectionId") long collectionId,
                                @Bind("learningType") String learningType,
                                @Bind("collectionStartIndex") int collectionStartIndex,
                                @Bind("collectionEndIndex") int collectionEndIndex);

    @RegisterBeanMapper(FlashCardInLearningInstance.class)
    @SqlQuery("""
            SELECT
                FlashCardUse.flashCardId as flashCardId,
                FlashCardUse.flashCardUseId as flashCardUseId,
                FlashCard.collectionId as collectionId,
                FlashCardUse.learningInstanceId as learningInstanceId,
                FlashCardUse.learningInstancePosition as positionIndex,
                FlashCard.frontText as frontText,
                FlashCard.backText as backText,
                FlashCardUse.frontFirst as frontFirst,
                FlashCardUse.complete as complete
            FROM FlashCardUse LEFT JOIN FlashCard
            ON FlashCardUse.flashCardId = FlashCard.flashCardId
            WHERE FlashCardUse.learningInstanceId = :learningInstanceId
            ORDER BY FlashCardUse.learningInstancePosition;
            """)
    List<FlashCardInLearningInstance> getLearningInstanceCards(@Bind("learningInstanceId") long learningInstanceId);

    @SqlUpdate("""
            INSERT INTO FlashCardUse (
                flashCardId, learningInstanceId, learningInstancePosition, frontFirst, complete
            )
            WITH FlashCardsWithFrontFirst as (
                SELECT
                    flashCardId,
                    (:frontFirst AND NOT :randomizeFrontFirst) OR (ROUND(RAND()) AND :randomizeFrontFirst) as frontFirst
                FROM FlashCardsWithPriority
                WHERE FlashCardsWithPriority.frontFirst
            )
            SELECT FlashCardsWithPriority.flashCardId,
                   :learningInstanceId,
                   ROW_NUMBER() OVER (ORDER BY priority),
                   FlashCardsWithFrontFirst.frontFirst,
                   false
            FROM FlashCardsWithPriority
            LEFT JOIN FlashCardsWithFrontFirst
            ON FlashCardsWithPriority.flashCardId = FlashCardsWithFrontFirst.flashCardId
            WHERE collectionID = :collectionId
              AND FlashCardsWithPriority.frontFirst = FlashCardsWithFrontFirst.frontFirst
              AND NOT seenToday
            LIMIT :limit OFFSET :offset;
            """)
    void populateLearningInstanceDaily(@Bind("learningInstanceId") long learningInstanceId,
                                       @Bind("collectionId") long collectionId,
                                       @Bind("frontFirst") boolean frontFirst,
                                       @Bind("randomizeFrontFirst") boolean randomizeFrontFirst,
                                       @Bind("limit") int limit,
                                       @Bind("offset") int offset);

    @SqlUpdate("""
            INSERT INTO FlashCardUse (
                flashCardId, learningInstanceId, learningInstancePosition, frontFirst, complete
            )
            WITH FlashCardsWithFrontFirst as (
                SELECT
                    flashCardId,
                    (:frontFirst AND NOT :randomizeFrontFirst) OR (ROUND(RAND()) AND :randomizeFrontFirst) as frontFirst
                FROM FlashCardsWithPriority
                WHERE FlashCardsWithPriority.frontFirst
            )
            SELECT FlashCardsWithPriority.flashCardId,
                   :learningInstanceId,
                   ROW_NUMBER() OVER (ORDER BY priority),
                   FlashCardsWithFrontFirst.frontFirst,
                   false
            FROM FlashCardsWithPriority
            LEFT JOIN FlashCardsWithFrontFirst
            ON FlashCardsWithPriority.flashCardId = FlashCardsWithFrontFirst.flashCardId
            WHERE collectionID = :collectionId
              AND FlashCardsWithPriority.frontFirst = FlashCardsWithFrontFirst.frontFirst
            LIMIT :limit OFFSET :offset;
            """)
    void populateLearningInstancePriority(@Bind("learningInstanceId") long learningInstanceId,
                                          @Bind("collectionId") long collectionId,
                                          @Bind("frontFirst") boolean frontFirst,
                                          @Bind("randomizeFrontFirst") boolean randomizeFrontFirst,
                                          @Bind("limit") int limit,
                                          @Bind("offset") int offset);

    @SqlUpdate("""
            INSERT INTO FlashCardUse (
                flashCardId, learningInstanceId, learningInstancePosition, frontFirst, complete
            )
            WITH FlashCardsWithFrontFirst as (
                SELECT
                    flashCardId,
                    (:frontFirst AND NOT :randomizeFrontFirst) OR (ROUND(RAND()) AND :randomizeFrontFirst) as frontFirst
                FROM FlashCardsWithPriority
                WHERE FlashCardsWithPriority.frontFirst
            )
            SELECT FlashCardsWithPriority.flashCardId,
                   :learningInstanceId,
                   ROW_NUMBER() OVER (ORDER BY FlashCardsWithPriority.collectionPosition),
                   FlashCardsWithFrontFirst.frontFirst,
                   false
            FROM FlashCardsWithPriority
            LEFT JOIN FlashCardsWithFrontFirst
            ON FlashCardsWithPriority.flashCardId = FlashCardsWithFrontFirst.flashCardId
            WHERE collectionID = :collectionId
              AND FlashCardsWithPriority.frontFirst = FlashCardsWithFrontFirst.frontFirst
            LIMIT :limit OFFSET :offset;
            """)
    void populateLearningInstanceInOrder(@Bind("learningInstanceId") long learningInstanceId,
                                         @Bind("collectionId") long collectionId,
                                         @Bind("frontFirst") boolean frontFirst,
                                         @Bind("randomizeFrontFirst") boolean randomizeFrontFirst,
                                         @Bind("limit") int limit,
                                         @Bind("offset") int offset);

    @SqlUpdate("""
            INSERT INTO FlashCardUse (
                flashCardId, learningInstanceId, learningInstancePosition, frontFirst, complete
            )
            WITH FlashCardsWithFrontFirst as (
                SELECT
                    flashCardId,
                    (:frontFirst AND NOT :randomizeFrontFirst) OR (ROUND(RAND()) AND :randomizeFrontFirst) as frontFirst
                FROM FlashCardsWithPriority
                WHERE FlashCardsWithPriority.frontFirst
            )
            SELECT FlashCardsWithPriority.flashCardId,
                   :learningInstanceId,
                   ROW_NUMBER() OVER (ORDER BY RAND()),
                   FlashCardsWithFrontFirst.frontFirst,
                   false
            FROM FlashCardsWithPriority
            LEFT JOIN FlashCardsWithFrontFirst
            ON FlashCardsWithPriority.flashCardId = FlashCardsWithFrontFirst.flashCardId
            WHERE collectionID = :collectionId
              AND FlashCardsWithPriority.frontFirst = FlashCardsWithFrontFirst.frontFirst
            LIMIT :limit OFFSET :offset;
            """)
    void populateLearningInstanceRandom(@Bind("learningInstanceId") long learningInstanceId,
                                        @Bind("collectionId") long collectionId,
                                        @Bind("frontFirst") boolean frontFirst,
                                        @Bind("randomizeFrontFirst") boolean randomizeFrontFirst,
                                        @Bind("limit") int limit,
                                        @Bind("offset") int offset);

    @SqlUpdate("""
            UPDATE FlashCardUse
            SET timestamp = :timestamp,
                timeTakenMs = :timeTakenMs,
                userFeedback = :userFeedback,
                complete = true
            WHERE flashCardUseId = :flashCardUseId;
            """)
    void logFlashCardUse(@Bind("flashCardUseId") long flashCardUseId,
                         @Bind("timestamp") Timestamp timestamp,
                         @Bind("timeTakenMs") Integer timeTakenMs,
                         @Bind("userFeedback") Integer userFeedback);

    @SqlQuery("""
            SELECT COUNT(*)
            FROM FlashCardsWithPriority
            WHERE collectionId = :collectionId
            AND frontFirst
            AND (NOT seenToday OR NOT :ignoreSeenToday);
            """)
    int getLearningInstanceSize(@Bind("collectionId") long collectionId,
                                @Bind("ignoreSeenToday") boolean ignoreSeenToday
    );

    @RegisterBeanMapper(LearningInstanceData.class)
    @SqlQuery("""
            SELECT
                Collection.collectionName as collectionName,
                LearningInstance.learningType as learningType,
                LearningInstance.collectionStartIndex as collectionStartIndex,
                LearningInstance.collectionEndIndex as collectionEndIndex,
                SUM(FlashCardUse.complete) as cardsDone,
                COUNT(*) as totalCards,
                MIN(FlashCardUse.timestamp) as startTime,
                MAX(FlashCardUse.timestamp) as endTime,
                SUM(FlashCardUse.timeTakenMs) as totalTimeTakenMs,
                SUM(FlashCardUse.userFeedback = 1) as totalGood,
                SUM(FlashCardUse.userFeedback = 0) as totalOkay,
                SUM(FlashCardUse.userFeedback = -1) as totalBad
            FROM FlashCardUse LEFT JOIN LearningInstance
            ON LearningInstance.learningInstanceId = FlashCardUse.learningInstanceId
            LEFT JOIN Collection
            ON Collection.collectionId = LearningInstance.collectionId
            WHERE LearningInstance.learningInstanceId = :learningInstanceId
            GROUP BY LearningInstance.learningInstanceId;
            """)
    Optional<LearningInstanceData> getLearningInstanceData(@Bind("learningInstanceId") long learningInstanceId);

    @RegisterBeanMapper(ContinueLearningData.class)
    @SqlQuery("""
            SELECT * FROM (
                SELECT
                    MAX(Collection.collectionId) as collectionId,
                    MAX(Collection.collectionName) as collectionName,
                    LearningInstance.learningInstanceId as learningInstanceId,
                    LearningInstance.startedTimestamp as startedTimestamp,
                    LearningInstance.learningType as learningType,
                    COUNT(*) AS totalCards,
                    SUM(FlashCardUse.complete) as cardsDone
                FROM Collection LEFT JOIN LearningInstance
                ON Collection.collectionId = LearningInstance.collectionId
                LEFT JOIN FlashCardUse
                ON LearningInstance.learningInstanceId = FlashCardUse.learningInstanceId
                WHERE Collection.userId = :userId
                GROUP BY LearningInstanceId
                ORDER BY startedTimestamp DESC
            ) ContinueLearningData
            WHERE ContinueLearningData.cardsDone < ContinueLearningData.totalCards
            LIMIT 10;
            """)
    List<ContinueLearningData> getContinueLearningItems(@Bind("userId") long userId);
}
