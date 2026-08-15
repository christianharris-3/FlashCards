import {Button, TextField} from "@mui/material";
import {useState} from "react";
import {getHeadersJson} from "../utils/utils.js";

export default function EditableText({row}) {
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [saveButtonLoading, setSaveButtonLoading] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState("");

    function collectionNameEdited(event, title) {
        setNewCollectionName(title);
        if (title !== row.collectionName) {
            setShowSaveButton(true)
        } else {
            setShowSaveButton(false);
        }
    }

    function saveTitle(event, collectionId) {
        setSaveButtonLoading(true);
        fetch("/api/collections/"+collectionId, {
            method: "PUT",
            headers: getHeadersJson(),
            body: JSON.stringify({collectionName: newCollectionName})
        }).then(r => {
            if (r.ok) {
                setSaveButtonLoading(false);
                setShowSaveButton(false);
                row.collectionName = newCollectionName;
            } else {
                console.log("failed to edit title", r);
            }
        })
    }

    return (
        <div style={{display: "flex", gap: "3px", height: "29px"}}>
            <TextField variant="standard"
                       defaultValue={row.collectionName}
                       size="small"
                       style={{flexGrow: 1}}
                       onChange={(e) => {
                           collectionNameEdited(e, e.target.value, row.collectionId)
                       }}/>
            {showSaveButton ?
                <Button loading={saveButtonLoading} size="medium"
                    onClick={(e) => {saveTitle(e, row.collectionId)
                }}>Save</Button> : <></>
            }
        </div>
    )
}