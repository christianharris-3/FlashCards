import {TableCell, TableRow} from "@mui/material";
import {getHeadersJson} from "../utils/utils.js";
import EditableText from "./EditableText.jsx";

export default function FlashCardRow({row, triggerReload, reloadKey}) {

    function saveIndex(newIndex, row) {
        return fetch(`/api/flashcard/${row.flashCardId}`, {
            method: "PUT",
            headers: getHeadersJson(),
            body: JSON.stringify({collectionPosition: newIndex})
        }).then(r => {
            if (r.ok) {
                triggerReload()
                return true;
            } else {
                return false
            }
        })
    }
    function saveFrontText(newFrontText, row) {
        return fetch(`/api/flashcard/${row.flashCardId}`, {
            method: "PUT",
            headers: getHeadersJson(),
            body: JSON.stringify({frontText: newFrontText})
        }).then(r => {
            if (r.ok) {
                row.frontText = newFrontText;
                return true;
            } else {
                return false
            }
        })
    }
    function saveBackText(newBackText, row) {
        return fetch(`/api/flashcard/${row.flashCardId}`, {
            method: "PUT",
            headers: getHeadersJson(),
            body: JSON.stringify({backText: newBackText})
        }).then(r => {
            if (r.ok) {
                row.backText = newBackText;
                return true;
            } else {
                return false
            }
        })
    }


    return (
        <TableRow hover key={`flashCardRow${row.flashCardId}-${reloadKey}`}>
            <TableCell size="small"><EditableText
                defaultText={row.collectionPosition}
                row={row}
                saveFunc={saveIndex}
                key={`textInputIndex${row.flashCardId}-${reloadKey}`}
            /></TableCell>
            <TableCell size="small"><EditableText
                defaultText={row.frontText}
                row={row}
                saveFunc={saveFrontText}
                key={`textInputFrontText${row.flashCardId}-${reloadKey}`}
            /></TableCell>
            <TableCell size="small"><EditableText
                defaultText={row.backText}
                row={row}
                saveFunc={saveBackText}
                key={`textInputBackText${row.flashCardId}-${reloadKey}`}
            /></TableCell>
        </TableRow>
    )
}