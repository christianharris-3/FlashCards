import {Paper, Stack, Typography} from "@mui/material";
import {getHeaders} from "../utils/utils.js";
import FlashCard from "../components/FlashCard/FlashCard.jsx";
import {useEffect, useState} from "react";
import FlashCardDeck from "../components/FlashCardDeck.jsx";

export default function LearnPage() {

    const [collectionData, setCollectionData] = useState(null);

    useEffect(() => {
        fetch(`/api/collection-by-priority/${1}`, {
            fetch: "GET",
            headers: getHeaders()
        }).then(r => {
            if (r.ok) {
                r.json().then(json => {
                    setCollectionData(json)
                    console.log(json)
                })
            }
        })
    }, []);

    return (
        <div className="page">
            <div style={{textAlign: "center", maxWidth: "800px", margin: "auto", padding: "40px"}}>
                <Typography>

                </Typography>
                <FlashCardDeck flashCardData={collectionData}/>
            </div>
        </div>
    )
}