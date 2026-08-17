import FlashCard from "./FlashCard/FlashCard.jsx";
import {Button, CircularProgress, Slider, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {getHeadersJson, toDateString} from "../utils/utils.js";

export default function FlashCardDeck({flashCardData, deckFinished}) {

    const [cardFlipped, setCardFlipped] = useState(false);
    const [currentFlashCard, setCurrentFlashCard] = useState(null);
    const [currentFlashCardIndex, setCurrentFlashCardIndex] = useState(0);
    const [prevSubmitTimestamp, setPrevSubmitTimestamp] = useState(new Date());


    function nextFlashCard() {
        let newIndex = currentFlashCardIndex + 1;
        setCardFlipped(false);
        if (cardFlipped) {
            setTimeout(() => {
                setCurrentFlashCard(flashCardData[newIndex]);
                setCurrentFlashCardIndex(newIndex);
            }, 150)
        } else {
            setCurrentFlashCard(flashCardData[newIndex]);
            setCurrentFlashCardIndex(newIndex);
        }
    }

    function submitFlashCard(userFeedback) {

        const timestamp = new Date();
        const timeTakenMs = Math.min(timestamp - prevSubmitTimestamp, 20000);

        fetch(`/api/log-flashcard-use/${currentFlashCard.flashCardId}`, {
            method: "POST",
            headers: getHeadersJson(),
            body: JSON.stringify({
                timestamp: toDateString(timestamp),
                userFeedback: userFeedback,
                timeTakenMs: timeTakenMs
            })
        }).then(r => {
            if (r.ok) {
                setPrevSubmitTimestamp(timestamp);
                nextFlashCard();
            }
        })
    }

    useEffect(() => {
        if (flashCardData !== null) {
            setCurrentFlashCard(flashCardData[0]);
        }
    }, [flashCardData]);

    if (flashCardData && currentFlashCardIndex >= flashCardData.length) {
        deckFinished()
    }

    return (
        <div style={{width: "350px", margin: "auto"}}>
            {currentFlashCard === null ?
                <div><CircularProgress /></div>:
                <div>
                    <div style={{display: "flex", padding: "10px", gap: "20px"}}>
                        <Typography variant="h6">{currentFlashCardIndex+1}/{flashCardData.length}</Typography>
                        <Slider min={0}
                                max={flashCardData.length}
                                value={currentFlashCardIndex}
                                color="primary"
                                disabledSwap={true}/>
                    </div>
                    <FlashCard frontText={currentFlashCard.frontText}
                               backText={currentFlashCard.backText}
                               cardFlipped={cardFlipped}
                               setCardFlipped={setCardFlipped}
                    />
                    <div style={{padding: 30, display: "flex", gap: "20px", justifyContent: "center"}}>
                        <Button variant="contained"
                                color="primary"
                                onClick={() => submitFlashCard(1)}
                        >Good</Button>
                        <Button variant="contained"
                                color="info"
                                onClick={() => submitFlashCard(0)}
                        >Ok</Button>
                        <Button variant="contained"
                                color="error"
                                onClick={() => submitFlashCard(-1)}
                        >Bad</Button>
                    </div>
                </div>
            }
        </div>
    )
}