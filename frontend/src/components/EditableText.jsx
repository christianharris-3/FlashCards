import {Button, TextField} from "@mui/material";
import {useState} from "react";

export default function EditableText({defaultText, row, saveFunc, htmlKey}) {
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [saveButtonLoading, setSaveButtonLoading] = useState(false);
    const [newText, setNewText] = useState("");

    function textEdited(event, title) {
        setNewText(title);
        if (title !== defaultText.toString()) {
            setShowSaveButton(true)
        } else {
            setShowSaveButton(false);
        }
    }

    function savePressed(event) {
        setSaveButtonLoading(true);
        if (saveFunc(newText, row)) {
            setSaveButtonLoading(false);
            setShowSaveButton(false);
        } else {
            setSaveButtonLoading(false);
            setShowSaveButton(false);
        }

    }


    return (
        <div style={{display: "flex", gap: "3px", marginLeft: "5px", flexWrap: "wrap", justifyContent: "center"}}>
            <TextField variant="standard"
                       key={htmlKey}
                       defaultValue={defaultText}
                       size="small"
                       style={{flexGrow: 1, minWidth: "30px", flexBasis: "40px"}}
                       onChange={(e) => {
                           textEdited(e, e.target.value)
                       }}
                       onKeyDown={(event) => {
                           if (event.key === "Enter") {savePressed(event)}
                       }}
            />
            {showSaveButton ?
                <Button loading={saveButtonLoading} size="medium" sx={{height: "29px"}}
                    onClick={(e) => {savePressed(e)
                }}>Save</Button> : <></>
            }
        </div>
    )
}