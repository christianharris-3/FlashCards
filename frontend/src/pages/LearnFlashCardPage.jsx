import FlashCardDeck from "../components/FlashCardDeck.jsx";
import {useEffect, useState} from "react";
import {getHeaders, msPlayedToString, validateResponse} from "../utils/utils.js";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Box, CircularProgress, Container, Divider, Paper, Typography} from "@mui/material";
import SimpleThreeItemBarChart from "../components/SimpleThreeItemBarChart/SimpleThreeItemBarChart.jsx";


export default function LearnFlashCardPage() {
    const navigate = useNavigate();
    const {learningInstanceId} = useParams();

    const [collectionData, setCollectionData] = useState(null);
    const [completeStats, setCompleteStats] = useState(null);

    const [deckComplete, setDeckComplete] = useState(false);


    useEffect(() => {
        fetch(`/api/learn/${learningInstanceId}`, {
            fetch: "GET",
            headers: getHeaders()
        }).then(r => {
            if (validateResponse(r, navigate)) {
                r.json().then(json => {
                    setCollectionData(json)
                })
            } else {
                navigate("/")
            }
        })
    }, []);

    useEffect(() => {
        if (deckComplete) {
            fetch(`/api/learn/data/${learningInstanceId}`, {
                fetch: "GET",
                headers: getHeaders()
            }).then(r => {
                if (validateResponse(r, navigate)) {
                    r.json().then(json => {
                        setCompleteStats(json)
                        console.log("finished Data", json)
                    })
                } else {
                    navigate("/")
                }
            })
        }
    }, [deckComplete])

    function deckFinished() {
        setDeckComplete(true);
    }

    return (
        <div>
            {deckComplete ?
                <div className="page">
                    <div style={{
                        textAlign: "center", maxWidth: "700px", margin: "auto",
                        padding: "40px", display: "flex", gap: "20px", flexDirection: "column"
                    }}>
                        <Paper style={{padding: "15px"}}>
                            {completeStats === null ?
                                <CircularProgress /> :
                                <div>
                                    <Typography variant="h4" style={{padding: "10px"}}>
                                        Complete: {completeStats.collectionName}
                                    </Typography>
                                    <Divider />
                                    <div style={{padding: "20px", display: "flex", justifyContent: "center", gap: "30px"}}>
                                        <Typography variant="body">
                                            Time Taken: {msPlayedToString(completeStats.totalTimeTakenMs)}
                                        </Typography>
                                        <Typography variant="body">
                                            Cards Complete: {completeStats.cardsDone}
                                        </Typography>
                                    </div>
                                    <SimpleThreeItemBarChart
                                        goodHeight={completeStats.totalGood}
                                        okayHeight={completeStats.totalOkay}
                                        badHeight={completeStats.totalBad}
                                    />
                                </div>
                            }
                        </Paper>
                    </div>
                </div>:
                <FlashCardDeck flashCardData={collectionData} deckFinished={deckFinished}/>
            }
        </div>
    )
}