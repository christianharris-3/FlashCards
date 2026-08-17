import FlashCardDeck from "../components/FlashCardDeck.jsx";
import {useEffect, useState} from "react";
import {getHeaders} from "../utils/utils.js";
import {useParams, useSearchParams} from "react-router-dom";


export default function LearnFlashCardPage() {
    const {learnType, collectionId} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const [collectionData, setCollectionData] = useState(null);

    const [deckComplete, setDeckComplete] = useState(false);

    useEffect(() => {

        let endpoints = {
            "priority": `/api/learn/priority/${collectionId}`,
            "daily": `/api/learn/daily/${collectionId}`,
            "random": `/api/learn/random/${collectionId}`
        }

        fetch(endpoints[learnType], {
            fetch: "GET",
            headers: getHeaders()
        }).then(r => {
            if (r.ok) {
                r.json().then(json => {
                    let start = searchParams.has("start") ? searchParams.get("start") : 0;
                    let end = searchParams.has("end") ? searchParams.get("end") : flashCards.length;
                    let flashCards = json.splice(start, end);
                    setCollectionData(flashCards)
                })
            }
        })
    }, []);

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