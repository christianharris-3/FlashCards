import FlashCard from "./FlashCard/FlashCard.jsx";
import {Button, CircularProgress, Slider, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {getHeadersJson, toDateString, validateResponse} from "../utils/utils.js";
import {useNavigate} from "react-router-dom";

export default function FlashCardDeck({flashCardData, deckFinished}) {
    const navigate = useNavigate();
    const [cardFlipped, setCardFlipped] = useState(false);
    const [currentFlashCard, setCurrentFlashCard] = useState(null);
    const [currentFlashCardIndex, setCurrentFlashCardIndex] = useState(0);
    const [prevSubmitTimestamp, setPrevSubmitTimestamp] = useState(new Date());
    const [clueLetters, setClueLetters] = useState(new Set());


    function nextFlashCard() {
        let newIndex = currentFlashCardIndex + 1;
        if (flashCardData && newIndex >= flashCardData.length) {
            deckFinished()
            return
        }
        let newFlipped = !flashCardData[newIndex].frontFirst;
        setCardFlipped(newFlipped);
        if (newFlipped !== cardFlipped) {
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
        setClueLetters(new Set());

        fetch(`/api/learn/log-flashcard-use/${currentFlashCard.flashCardUseId}`, {
            method: "POST",
            headers: getHeadersJson(),
            body: JSON.stringify({
                timestamp: toDateString(timestamp),
                userFeedback: userFeedback,
                timeTakenMs: timeTakenMs
            })
        }).then(r => {
            if (validateResponse(r, navigate)) {
                setPrevSubmitTimestamp(timestamp);
                nextFlashCard();
            }
        })
    }

    function getClue() {
        let len = currentFlashCard.frontText.length;
        if (currentFlashCard.frontFirst) {
            len = currentFlashCard.backText.length;
        }
        if (clueLetters.size < len) {
            let ran = Math.floor(Math.random()*len)
            while (clueLetters.has(ran)) {
                ran = Math.floor(Math.random()*len)
            }
            setClueLetters(oldLetters => {
                let letters = new Set(oldLetters);
                letters.add(ran);
                return letters;
            })
        }
        if (currentFlashCard.frontFirst !== cardFlipped) {
            setCardFlipped(!cardFlipped)
        }
    }

    function revealAnswer() {
        setClueLetters(new Set());
    }

    function getText(isFront) {
        let text = isFront ? currentFlashCard.frontText : currentFlashCard.backText;

        if (isFront === currentFlashCard.frontFirst || clueLetters.size === 0) {
            return text;
        }
        let newText = ""
        for (let i = 0; i<text.length; i++) {
            if (clueLetters.has(i)) {
                newText = newText.concat(text[i])
            } else {
                newText = newText.concat("_")
            }
        }
        return newText
    }

    useEffect(() => {
        if (flashCardData !== null) {
            let newIndex = 0;
            while (newIndex < flashCardData.length && flashCardData[newIndex].complete) {
                newIndex += 1;
            }
            if (newIndex >= flashCardData.length) {
                deckFinished()
                return
            }
            setCurrentFlashCard(flashCardData[newIndex]);
            setCurrentFlashCardIndex(newIndex);
            setCardFlipped(!flashCardData[newIndex].frontFirst)
        }
    }, [flashCardData]);

    if (currentFlashCard === null) {
        return (
            <div style={{width: "350px", margin: "auto"}}>
                <div><CircularProgress /></div>
            </div>
        )
    }

    let frontText = getText(true);
    let backText = getText(false);

    return (
        <div style={{width: "350px", margin: "auto"}}>
            <div>
                <div style={{display: "flex", padding: "10px", gap: "20px"}}>
                    <Typography variant="h6">{currentFlashCardIndex+1}/{flashCardData.length}</Typography>
                    <Slider min={0}
                            max={flashCardData.length-1}
                            value={currentFlashCardIndex}
                            color="primary"
                            disabledSwap={true}/>
                </div>
                <FlashCard frontText={frontText}
                           backText={backText}
                           cardFlipped={cardFlipped}
                           setCardFlipped={setCardFlipped}
                />
                <div style={{padding: 30, display: "flex", gap: "20px", justifyContent: "center"}}>
                    <Button variant="contained"
                            color="primary"
                            onClick={() => submitFlashCard(1)}
                            disabled={clueLetters.size > 0}
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
                <div style={{display: "flex", justifyContent: "center", gap: "10px"}}>
                    <Button variant="outlined"
                            color="info"
                            onClick={getClue}
                    >Clue</Button>
                    {/*{clueLetters.size !== 0 &&*/}
                    {/*    <Button variant="outlined"*/}
                    {/*            onClick={revealAnswer}*/}
                    {/*    >Reveal</Button>*/}
                    {/*}*/}
                </div>
            </div>
        </div>
    )
}