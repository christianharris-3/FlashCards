package com.flashcards.app.dao;

import com.flashcards.app.models.dao.CollectionInfo;
import com.flashcards.app.models.dao.FlashCard;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.statement.GetGeneratedKeys;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CollectionDao {

    @RegisterBeanMapper(CollectionInfo.class)
    @SqlQuery("""
            SELECT Collection.collectionId,
                   Collection.collectionName,
                   COUNT(FlashCard.flashCardId) as itemCount
            FROM Collection LEFT JOIN FlashCard
            ON Collection.collectionId = FlashCard.collectionId
            WHERE (Collection.userId = :userId)
            GROUP BY Collection.collectionId
            ORDER BY Collection.collectionId;
            """)
    List<CollectionInfo> getCollectionInfo(@Bind("userId") long userId);

    @RegisterBeanMapper(CollectionInfo.class)
    @SqlQuery("""
            SELECT Collection.collectionId,
                   Collection.collectionName,
                   COUNT(FlashCard.flashCardId) as itemCount
            FROM Collection LEFT JOIN FlashCard
            ON Collection.collectionId = FlashCard.collectionId
            WHERE (Collection.collectionId = :collectionId)
            GROUP BY Collection.collectionId;
            """)
    Optional<CollectionInfo> getSingleCollectionInfo(@Bind("collectionId") long collectionId);

    @SqlUpdate("""
            UPDATE Collection
            SET collectionName = :collectionName
            WHERE :collectionId = collectionId;
            """)
    void updateCollection(@Bind("collectionId") long collectionId, @Bind("collectionName") String collectionName);


    @SqlUpdate("""
            DELETE FROM Collection
            WHERE :collectionId = collectionId;
            """)
    void deleteCollection(@Bind("collectionId") long collectionId);

    @SqlUpdate("""
            DELETE FROM FlashCard
            WHERE :collectionId = collectionId;
            """)
    void deleteFlashCards(@Bind("collectionId") long collectionId);

    @SqlUpdate("""
        INSERT INTO Collection (userId, collectionName)
        VALUES (:userId, :collectionName);
    """)
    @GetGeneratedKeys
    long createCollection(@Bind("userId") long userId, @Bind("collectionName") String collectionName);
}
