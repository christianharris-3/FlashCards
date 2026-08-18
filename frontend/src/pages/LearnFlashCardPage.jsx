import FlashCardDeck from "../components/FlashCardDeck.jsx";
import {useEffect, useState} from "react";
import {getHeaders, validateResponse} from "../utils/utils.js";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";


export default function LearnFlashCardPage() {
    const navigate = useNavigate();
    const {learningInstanceId} = useParams();

    const [collectionData, setCollectionData] = useState(null);

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
                        console.log("finished Data", json)
                    })
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
                <div>done</div>:
                <FlashCardDeck flashCardData={collectionData} deckFinished={deckFinished}/>
            }
        </div>
    )
}