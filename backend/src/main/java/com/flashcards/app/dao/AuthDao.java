package com.flashcards.app.dao;

import com.flashcards.app.models.dao.FlashCardUserValidation;
import com.flashcards.app.models.dao.UserFromDb;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.statement.GetGeneratedKeys;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface AuthDao {
    @RegisterBeanMapper(UserFromDb.class)
    @SqlQuery("""
            SELECT userId, activeCollectionId, username, passwordHash
            FROM Users
            WHERE (:username = username);
            """)
    Optional<UserFromDb> getUser(@Bind("username") String username);

    @SqlQuery("""
            SELECT role
            FROM UserRole
            WHERE (:userId = userId);
            """)
    Set<String> getUserRoles(@Bind("userId") long userId);

    @SqlUpdate("""
            INSERT INTO Users (username, passwordHash)
            VALUES (:username, :passwordHash);
            """)
    @GetGeneratedKeys
    long registerUser(@Bind("username") String username, @Bind("passwordHash") String passwordHash);

    @SqlUpdate("""
            INSERT INTO UserRole (userId, role)
            VALUES (:userId, :role);
            """)
    void addUserRole(@Bind("userId") long userId, @Bind("role") String role);

    @SqlQuery("""
            SELECT CollectionId FROM Collection
            WHERE :userId = userId;
            """)
    List<Long> getUserCollections(@Bind("userId") long userId);


    @SqlUpdate("""
            UPDATE Users
            SET activeCollectionId = :collectionId
            WHERE userId = :userId;
            """)
    void setActiveCollection(@Bind("userId") long userId, @Bind("collectionId") long collectionId);

    @SqlQuery("""
            SELECT Collection.userId
            FROM LearningInstance JOIN Collection
            ON LearningInstance.collectionId = Collection.collectionId
            WHERE LearningInstance.learningInstanceId = :learningInstanceId;
            """)
    Optional<Long> getLearningInstanceUserId(@Bind("learningInstanceId") long learningInstanceId);

    @RegisterBeanMapper(FlashCardUserValidation.class)
    @SqlQuery("""
            SELECT Collection.userId as userId, FlashCardUse.complete as complete
            FROM FlashCardUse JOIN FlashCard
            ON FlashCardUse.flashCardId = FlashCard.flashCardId
            AND FlashCardUse.flashCardUseId = :flashCardUseId
            JOIN Collection
            ON FlashCard.collectionId = Collection.collectionId;
            """)
    Optional<FlashCardUserValidation> getFlashCardUseById(@Bind("flashCardUseId") long flashCardUseId);
}
