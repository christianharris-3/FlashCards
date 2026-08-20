import {Button, Paper, TextField, Typography} from "@mui/material";
import {getHeadersJson, validateResponse} from "../utils/utils.js";
import {useState} from "react";
import {useNavigate} from "react-router-dom";


export default function CreateFlashCard({collectionId, triggerReload}) {
    const navigate = useNavigate();
    const [newFlashCardFrontText, setNewFlashCardFrontText] = useState("");
    const [newFlashCardBackText, setNewFlashCardBackText] = useState("");

    function handleCreateFlashCard() {
        fetch("/api/flashcard", {
            method: "POST",
            headers: getHeadersJson(),
            body: JSON.stringify({
                collectionId: collectionId,
                frontText: newFlashCardFrontText,
                backText: newFlashCardBackText
            })
        }).then(r => {
            if (validateResponse(r, navigate)) {
                triggerReload()
            }
        })
    }

    return (
        <Paper style={{padding: "10px", paddingBottom: "20px"}}>
            <Typography sx={{margin: "10px"}} variant="h5">Add Flash Card</Typography>
            <div style={{display: "flex", gap: "20px", justifyContent: "center"}}>
                <TextField size="small"
                           label="English"
                           onChange={(e) => {
                               setNewFlashCardFrontText(e.target.value)
                           }}/>
                <TextField size="small"
                           label="Polish"
                           onChange={(e) => {
                               setNewFlashCardBackText(e.target.value)
                           }}/>
                <Button variant="outlined" onClick={handleCreateFlashCard}>Create</Button>
            </div>
        </Paper>
    )
}