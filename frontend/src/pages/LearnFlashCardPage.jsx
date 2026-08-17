import FlashCardDeck from "../components/FlashCardDeck.jsx";
import {useEffect, useState} from "react";
import {getHeaders} from "../utils/utils.js";
import {useParams, useSearchParams} from "react-router-dom";


export default function LearnFlashCardPage() {
    const {learningInstanceId} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const [collectionData, setCollectionData] = useState(null);

    const [deckComplete, setDeckComplete] = useState(false);

    useEffect(() => {
        fetch(`/api/learn/${learningInstanceId}`, {
            fetch: "GET",
            headers: getHeaders()
        }).then(r => {
            if (r.ok) {
                r.json().then(json => {
                    setCollectionData(json)
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