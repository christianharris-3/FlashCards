import {getHeaders} from "../utils/utils.js";
import {Button, CircularProgress} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useState} from "react";
import ConfirmDialog from "./ConfirmDialog.jsx";

export default function DeleteCollection({collectionId, collectionName, triggerDataReload}) {
    const [buttonLoading, setButtonLoading] = useState(false);

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

    function deleteCollection() {
        setButtonLoading(true)
        fetch("/api/collections/" + collectionId, {
            method: "DELETE", headers: getHeaders()
        }).then(r => {
            setButtonLoading(false)
            triggerDataReload()
        });
    }

    return (<div style={{width: "fit-content", margin: "auto"}}>
            {buttonLoading ?
            <div>
                <CircularProgress size="30px"/>
            </div> :
            <Button onClick={() => setDeleteConfirmationOpen(true)} style={{width: "fit-content", minWidth: "fit-content"}}>
                <Delete color="error"/>
            </Button>}
            <ConfirmDialog open={deleteConfirmationOpen}
                           setOpen={setDeleteConfirmationOpen}
                           onDelete={deleteCollection}
                           message={`Deleting Collection ${collectionName}`}
            />
        </div>)
}