WITH FlashCardsWithFixed AS (
    SELECT flashCardId, collectionPosition, (flashCardId = -1) AS isFixed
    FROM FlashCard WHERE (collectionId = 1)
), ReorderData AS (
    SELECT flashCardId, ROW_NUMBER() OVER (ORDER BY collectionPosition ASC, isFixed DESC) AS newCollectionPosition
    FROM FlashCardsWithFixed;
)
UPDATE FlashCard original
    JOIN ReorderData new
ON original.flashCardId = new.flashCardId
    SET original.collectionPosition = new.newCollectionPosition;