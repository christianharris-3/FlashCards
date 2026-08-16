import FlashCardDeck from "../components/FlashCardDeck.jsx";
import {useEffect, useState} from "react";
import {getHeaders} from "../utils/utils.js";
import {useParams} from "react-router-dom";


export default function LearnFlashCardPage() {
    const {learnType, collectionId} = useParams();

    const [collectionData, setCollectionData] = useState(null);

    useEffect(() => {

        fetch(`/api/collection-by-priority/${collectionId}`, {
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

    return (
        <div>
            <FlashCardDeck flashCardData={collectionData}/>
        </div>
    )
}