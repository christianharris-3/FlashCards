package com.flashcards.app.managers;

import com.flashcards.app.dao.AuthDao;
import com.flashcards.app.dao.CollectionDao;
import com.flashcards.app.dao.FlashCardDao;
import com.flashcards.app.models.dao.CollectionInfo;
import com.flashcards.app.models.response.CollectionData;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class CollectionManager {
    private static final Logger log = LoggerFactory.getLogger(CollectionManager.class);

    private final CollectionDao collectionDao;
    private final FlashCardDao flashCardDao;
    private final AuthDao authDao;

    public CollectionManager(CollectionDao collectionDao, FlashCardDao flashCardDao, AuthDao authDao) {
        this.collectionDao = collectionDao;
        this.flashCardDao = flashCardDao;
        this.authDao = authDao;
    }

    public List<CollectionData> getCollections(long userId) {
        List<CollectionInfo> collectionInfoList = collectionDao.getCollectionInfo(userId);

        List<CollectionData> collectionDataList = new ArrayList<>();

        for (CollectionInfo info : collectionInfoList) {
            collectionDataList.add(
                    new CollectionData(
                            info.getCollectionId(),
                            info.getCollectionName(),
                            info.getItemCount(),
                            flashCardDao.getFlashCards(info.getCollectionId())
                    )
            );
        }
        return collectionDataList;
    }

    public Optional<CollectionInfo> getCollection(long collectionId) {
        return collectionDao.getSingleCollectionInfo(collectionId);
    }

    public void deleteCollection(long collectionId) {
        collectionDao.deleteCollection(collectionId);
        collectionDao.deleteFlashCards(collectionId);
    }

    public void updateCollection(long collectionId, String collectionName) {
        collectionDao.updateCollection(collectionId, collectionName);
    }

    public void setActiveCollection(long userId, long collectionId) {
        authDao.setActiveCollection(userId, collectionId);
    }

    public long storeExcelFile(Workbook workbook, long userId) {

        String collectionName = generateCollectionName(userId);
        long collectionId = collectionDao.createCollection(userId, collectionName);

        Sheet sheet = workbook.getSheetAt(0);
        for (Row row : sheet) {
            storeFlashCard(
                    collectionId,
                    row.getCell(0).getStringCellValue(),
                    row.getCell(1).getStringCellValue()
            );
        }
        return collectionId;
    }


    private void storeFlashCard(long collectionId, String frontText, String backText) {
        flashCardDao.createFlashCard(
                collectionId, frontText, backText
        );
    }


    private String generateCollectionName(long userId) {
        List<CollectionInfo> collections = collectionDao.getCollectionInfo(userId);
        long maxId = 0;
        for (CollectionInfo collection : collections) {
            if (collection.getCollectionId() > maxId) {
                maxId = collection.getCollectionId();
            }
        }

        return String.format("Collection %s", maxId + 1);
    }
}