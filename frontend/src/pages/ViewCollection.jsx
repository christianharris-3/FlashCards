import {useParams} from "react-router-dom";
import {Paper} from "@mui/material";

export default function ViewCollection() {
    const {collectionId} = useParams();



    return (
        <div className="page">
            <div style={{textAlign: "center", maxWidth: "800px", margin: "auto", padding: "40px"}}>
                <Paper style={{flexGrow: 1, display: "flex", padding: "30px"}}>
                    yo hi {collectionId}
                </Paper>
            </div>
        </div>
    )
}