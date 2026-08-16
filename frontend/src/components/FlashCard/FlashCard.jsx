import "./FlashCard.css";
import {useState} from "react";
import {Typography} from "@mui/material";


export default function FlashCard({frontText, backText, cardFlipped, setCardFlipped}) {

    function flipCard() {
        setCardFlipped(!cardFlipped);
    }

    return (
        <div onClick={flipCard} style={{display: "flex", justifyContent: "center", textAlign: "center"}}>
            <div className={cardFlipped? "flashcard flipped" : "flashcard"}>
                <Typography variant="h5">
                    {frontText}
                </Typography>
            </div>
            <div className={cardFlipped? "flashcard" : "flashcard flipped"} id="cardBack" style={{position: "absolute"}}>
                <Typography variant="h5">
                    {backText}
                </Typography>
            </div>
        </div>
    )
}