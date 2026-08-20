import {Button, CircularProgress, TableCell, TableRow} from "@mui/material";
import {getHeaders, getHeadersJson, validateResponse} from "../utils/utils.js";
import EditableText from "./EditableText.jsx";
import {useNavigate} from "react-router-dom";
import DeleteCollection from "./DeleteCollection.jsx";
import {Delete} from "@mui/icons-material";

export default function FlashCardRow({row, triggerReload, reloadKey}) {
    const navigate = useNavigate();

    function saveIndex(newIndex, row) {
        return fetch(`/api/flashcard/${row.flashCardId}`, {
            method: "PUT",
            headers: getHeadersJson(),
            body: JSON.stringify({collectionPosition: newIndex})
        }).then(r => {
            if (validateResponse(r, navigate)) {
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
            if (validateResponse(r, navigate)) {
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
            if (validateResponse(r, navigate)) {
                row.backText = newBackText;
                return true;
            } else {
                return false
            }
        })
    }

    function deleteFlashCard() {
        fetch(`/api/flashcard/${row.flashCardId}`, {
            method: "DELETE",
            headers: getHeaders()
        }).then(r => {
            if (validateResponse(r, navigate)) {
                triggerReload();
            }
        })
    }


    return (
        <TableRow hover key={`flashCardRow${row.collectionPosition}-${row.flashCardId}-${reloadKey}`}>
            <TableCell size="small"><EditableText
                defaultText={row.collectionPosition}
                row={row}
                saveFunc={saveIndex}
                htmlKey={`textInputIndex${row.collectionPosition}-${row.flashCardId}-${reloadKey}`}
            /></TableCell>
            <TableCell size="small" ><EditableText
                defaultText={row.frontText}
                row={row}
                saveFunc={saveFrontText}
                htmlKey={`textInputFrontText${row.collectionPosition}-${row.flashCardId}-${reloadKey}`}
            /></TableCell>
            <TableCell size="small"><EditableText
                defaultText={row.backText}
                row={row}
                saveFunc={saveBackText}
                htmlKey={`textInputBackText${row.collectionPosition}-${row.flashCardId}-${reloadKey}`}
            /></TableCell>
            <TableCell align="center" style={{padding: 0}}>
                <div style={{width: "fit-content", margin: "auto"}}>
                    <Button onClick={deleteFlashCard} style={{width: "fit-content", minWidth: "fit-content"}}>
                        <Delete color="error"/>
                    </Button>
                </div></TableCell>
        </TableRow>
    )
}