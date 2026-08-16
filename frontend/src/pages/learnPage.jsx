import {Paper} from "@mui/material";
import {getHeaders} from "../utils/utils.js";
import FlashCard from "../components/FlashCard/FlashCard.jsx";

export default function LearnPage() {

    fetch(`/api/collection-by-priority/${1}`, {
        fetch: "GET",
        headers: getHeaders()
    }).then(r => {
        if (r.ok) {
            r.json().then(json => {
                console.log(json)
            })
        }
    })

    return (
        <div className="page">
            <div style={{textAlign: "center", maxWidth: "800px", margin: "auto", padding: "40px"}}>
                <div style={{flexGrow: 1, display: "flex", padding: "30px"}}>
                    learning goes here
                    <FlashCard frontText="front" backText="back"/>
                </div>
            </div>
        </div>
    )
}