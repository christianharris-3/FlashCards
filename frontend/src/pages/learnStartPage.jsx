import {
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select, Slider,
    Stack,
    Typography
} from "@mui/material";
import {getHeaders, getHeadersJson} from "../utils/utils.js";
import FlashCard from "../components/FlashCard/FlashCard.jsx";
import {useEffect, useState} from "react";
import FlashCardDeck from "../components/FlashCardDeck.jsx";
import Selector from "../components/Selector/Selector.jsx";
import {useNavigate} from "react-router-dom";

export default function LearnStartPage() {
    const navigate = useNavigate();
    const learnTypes = ["Daily", "Priority", "In Order", "Random"]
    const [selectedLearnType, setSelectedLearnType] = useState(learnTypes[0]);
    const learnDescriptions = {
        "Daily": "All flash cards that you haven't seen today, in order of priority.",
        "Priority": "All flash cards in the collection, in order of priority.",
        "In Order": "All flash cards in the collection, in their given order.",
        "Random": "All flash cards in the collection, in a random order."
    }

    const [collectionList, setCollectionList] = useState(null);
    const [collectionSelected, setCollectionSelected] = useState(null);

    const [numCards, setNumCards] = useState("Custom")
    const numCardsOptions = ["25", "50", "100", "200", "All", "Custom"]

    const [rangeSliderValue, setRangeSliderValue] = useState([0, 100]);
    const [rangeSliderDisabled, setRangeSliderDisabled] = useState(false);
    const rangeMinDistance = 25;
    const totalCards = 500;

    const showRangeUi = ["Priority", "In Order"].includes(selectedLearnType);

    useEffect(() => {
        fetch("/api/collections", {
            method: "GET",
            headers: getHeaders()
        }).then(r => r.json()).then(json => {
            setCollectionList(json);
            setCollectionSelected(json[0]?.collectionId);
        });
    }, []);

    function handleChangeSelection(event) {
        setCollectionSelected(event.target.value)
    }

    function handleStartPressed() {
        fetch(`/api/learn/create/${selectedLearnType.toLowerCase().replace(" ", "")}/${collectionSelected}`, {
            method: "POST",
            headers: getHeadersJson(),
            body: JSON.stringify({
                start: rangeSliderValue[0],
                end: rangeSliderValue[1]
            })
        }).then(r => {
            if (r.ok) {
                r.json().then(json => {
                    navigate(`/learn/${json.learningInstanceId}`)
                })
            }
        })
    }

    function handChangeNumCards(event) {
        setNumCards(event.target.value)
        if (event.target.value === "All") {
            setRangeSliderValue([0, totalCards])
            setRangeSliderDisabled(true);
        } else {
            setRangeSliderDisabled(false);
            if (event.target.value !== "Custom") {
                clampRangeSlider(rangeSliderValue, 0, parseInt(event.target.value));
            }
        }
    }

    function handleChangeRangeSlider(event, value, activeThumb) {
        if (numCards === "Custom") {
            if (value[1] - value[0] < rangeMinDistance) {
                clampRangeSlider(value, activeThumb, rangeMinDistance)
            } else {
                setRangeSliderValue(value);
            }
        } else if (numCards !== "All") {
            const intNumCards = parseInt(numCards);
            clampRangeSlider(value, activeThumb, intNumCards)
        }
    }

    function clampRangeSlider(value, activeThumb, rangeDiff) {
        if (activeThumb === 0) {
            const clamped = Math.min(value[0], totalCards - rangeDiff);
            setRangeSliderValue([clamped, clamped + rangeDiff]);
        } else {
            const clamped = Math.max(value[1], rangeDiff);
            setRangeSliderValue([clamped - rangeDiff, clamped]);
        }
    }

    return (
        <div className="page">
            <div style={{
                textAlign: "center", maxWidth: "700px", margin: "auto",
                padding: "40px", display: "flex", gap: "20px", flexDirection: "column"
            }}>
                <Typography variant="h4">
                    Practise Collection
                </Typography>
                {collectionList === null?
                    <CircularProgress />:
                    <FormControl variant="outlined" style={{width: "fit-content", margin: "auto", minWidth: "250px"}} aria-label="collectionSelection">
                        <InputLabel id="collectionSelectionLabel">Collection</InputLabel>
                        <Select value={collectionSelected}
                                label="Collection"
                                labelId="collectionSelectionLabel"
                                onChange={handleChangeSelection}
                                variant="outlined"
                        >
                            {collectionList.map((item) =>
                                <MenuItem value={item.collectionId}>
                                    {item.collectionName}
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                }
                <div>
                    <Selector items={learnTypes}
                              selectedValue={selectedLearnType}
                              setSelectedValue={setSelectedLearnType}
                              style={{marginBottom: "10px"}}
                    />
                    <Typography variant="body">
                        {learnDescriptions[selectedLearnType]}
                    </Typography>
                </div>
                {showRangeUi &&
                    <div style={{paddingTop: "15px"}}>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <Typography variant="body" style={{alignContent: "center"}}>
                                Range In Card Deck: {rangeSliderValue[0]} - {rangeSliderValue[1]}
                            </Typography>
                            <FormControl variant="outlined" size="small" style={{minWidth: "150px"}} aria-label="numCardsSelection">
                                <InputLabel id="numCardsSelectionLabel">Num Cards</InputLabel>
                                <Select variant="outlined"
                                        value={numCards}
                                        label="numCards"
                                        labelId="numCardsSelectionLabel"
                                        onChange={handChangeNumCards}
                                >
                                    {numCardsOptions.map((item) =>
                                        <MenuItem value={item}>
                                            {item}
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </div>
                        <Slider onChange={handleChangeRangeSlider}
                                value={rangeSliderValue}
                                getAriaLabel={() => "Minimum distance shift"}
                                step={rangeMinDistance}
                                min={0}
                                max={totalCards}
                                marks
                                disableSwap
                                disabled={rangeSliderDisabled}
                        />
                    </div>
                }

                <Button variant="contained"
                        style={{width: "200px", margin: "auto"}}
                        size="large"
                        onClick={handleStartPressed}
                >Start</Button>
            </div>
        </div>
    )
}