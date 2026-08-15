import {getHeaders} from "../utils/utils.js";
import {Button, CircularProgress} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useState} from "react";

export default function DeleteCollection({collectionId, triggerDataReload}) {
    const [buttonLoading, setButtonLoading] = useState(false);

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
            <Button onClick={deleteCollection} style={{width: "fit-content", minWidth: "fit-content"}}>
                <Delete color="error"/>
            </Button>}
        </div>)
}