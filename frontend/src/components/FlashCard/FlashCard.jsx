import "./FlashCard.css";
import {useState} from "react";
import {Typography} from "@mui/material";


export default function FlashCard({frontText, backText}) {

    const [cardFlipped, setCardFlipped] = useState(false);

    function flipCard() {
        setCardFlipped(!cardFlipped);
    }

    return (
        <div onClick={flipCard} style={{display: "flex"}}>
            <div className={cardFlipped? "flashcard" : "flashcard flipped"}>
                <Typography variant="h5">
                    {frontText}
                </Typography>
            </div>
            <div className={cardFlipped? "flashcard flipped" : "flashcard"} style={{position: "absolute"}}>
                <Typography variant="h5">
                    {backText}
                </Typography>
            </div>
        </div>
    )
}