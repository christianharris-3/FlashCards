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
import {getHeaders, getHeadersJson, validateResponse} from "../utils/utils.js";
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

    const [numCards, setNumCards] = useState("100")
    const numCardsOptions = ["25", "50", "100", "200", "All", "Custom"]

    const [rangeSliderValue, setRangeSliderValue] = useState([100, 200]);
    const [rangeSliderDisabled, setRangeSliderDisabled] = useState(false);
    const [rangeSliderMarks, setRangeSliderMarks] = useState(false);
    const [totalCards, setTotalCards] = useState(500);
    const rangeMinDistance = 25;


    const selectionsWithRangeUI = ["Priority", "In Order"];
    const showRangeUi = selectionsWithRangeUI.includes(selectedLearnType);
    if (!showRangeUi && rangeSliderDisabled) {
        setRangeSliderDisabled(false)
    }

    useEffect(() => {
        fetch("/api/collections", {
            method: "GET",
            headers: getHeaders()
        }).then(r => {
            if (validateResponse(r, navigate)) {
                r.json().then(json => {
                    setCollectionList(json);
                    setCollectionSelected(json[0]?.collectionId);
                });
            }
        });
    }, []);

    function getLearningApiParams() {
        if (showRangeUi) {
            return {
                startIndex: rangeSliderValue[0],
                endIndex: rangeSliderValue[1]
            }
        }
        return {
            startIndex: 0,
            endIndex: rangeSliderValue[0]
        };
    }
    function getLearningApiUrl() {
        return `/api/learn/create/${selectedLearnType.toLowerCase().replace(" ", "")}/${collectionSelected}`
    }

    useEffect(() => {
        fetch(getLearningApiUrl(), {
            method: "GET",
            headers: getHeadersJson()
        }).then(r => {
            if (validateResponse(r, navigate)) {
                return r.json().then(json => {
                    setTotalCards(json.value);
                    setRangeSliderMarks([
                        {value: 0, label: "0"},
                        {value: json.value, label: json.value.toString()}
                    ])
                })
            }
        });
    }, [selectedLearnType, collectionSelected]);

    function handleChangeSelection(event) {
        setCollectionSelected(event.target.value)
    }

    function setLearningType(newLearningType) {
        setSelectedLearnType(newLearningType);
        if (selectionsWithRangeUI.includes(newLearningType)) {
            setNumCards("Custom")
        }
        clampRangeSlider(rangeSliderValue, 0, Math.max(rangeSliderValue[1]-rangeSliderValue[0], 25))
    }

    function handleStartPressed() {
        fetch(getLearningApiUrl(), {
            method: "POST",
            headers: getHeadersJson(),
            body: JSON.stringify(getLearningApiParams())
        }).then(r => {
            if (validateResponse(r, navigate)) {
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

    function handChangeNumCardsFixed(event) {
        setNumCards(event.target.value);
        if (event.target.value === "All") {
            setRangeSliderValue([totalCards, rangeSliderValue[1]]);
        } else if (event.target.value !== "Custom"){
            setRangeSliderValue([parseInt(event.target.value), rangeSliderValue[1]]);
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

    function handleChangeRange(event, value) {
        setRangeSliderValue([value, rangeSliderValue[1]])
    }

    function clampRangeSlider(value, activeThumb, rangeDiff) {
        if (value[0]>value[1]) {
            value = [value[1], value[0]]
        }
        if (activeThumb === 0) {
            const clamped = Math.min(value[0], totalCards - rangeDiff);
            setRangeSliderValue([clamped, clamped + rangeDiff]);
        } else {
            const clamped = Math.max(value[1], rangeDiff);
            setRangeSliderValue([clamped - rangeDiff, clamped]);
        }
    }

    let realNumCards = rangeSliderValue[0];
    if (showRangeUi) {
        realNumCards = rangeSliderValue[1]-rangeSliderValue[0]
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
                <Paper style={{padding: "15px", display: "flex", flexDirection: "column", gap: "10px"}}>
                    <Typography variant="h5">
                        Deck Type
                    </Typography>
                    <Selector items={learnTypes}
                              selectedValue={selectedLearnType}
                              setSelectedValue={setLearningType}
                    />
                    <Typography variant="body">
                        {learnDescriptions[selectedLearnType]}
                    </Typography>
                </Paper>
                <Paper style={{padding: "15px"}}>
                    <Typography variant="h5">
                        Cards In Deck
                    </Typography>
                {showRangeUi ?
                    <div>
                        <Typography>
                            Number of cards: {rangeSliderValue[1]-rangeSliderValue[0]}
                        </Typography>

                        <div style={{display: "flex", justifyContent: "space-between", marginTop: "-40px"}}>
                            <Typography variant="body" style={{alignContent: "center"}}>
                                Range: {rangeSliderValue[0]} - {rangeSliderValue[1]}
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
                                marks={rangeSliderMarks}
                                disableSwap
                                disabled={rangeSliderDisabled}
                        />
                    </div>:
                    <div>
                        <Typography>
                            Number of cards: {rangeSliderValue[0]}
                        </Typography>
                        {/*this is straight copy pasted but oh well*/}
                        <div style={{display: "flex", justifyContent: "right", marginTop: "-40px"}}>
                            <FormControl variant="outlined" size="small" style={{minWidth: "150px"}} aria-label="numCardsSelection">
                                <InputLabel id="numCardsSelectionLabel">Num Cards</InputLabel>
                                <Select variant="outlined"
                                        value={numCards}
                                        label="numCards"
                                        labelId="numCardsSelectionLabel"
                                        onChange={handChangeNumCardsFixed}
                                >
                                    {numCardsOptions.map((item) =>
                                            <MenuItem value={item}>
                                                {item}
                                            </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </div>

                        <Slider onChange={handleChangeRange}
                                value={rangeSliderValue[0]}
                                step={rangeMinDistance}
                                min={0}
                                max={totalCards}
                                marks={rangeSliderMarks}
                                disableSwap
                                disabled={rangeSliderDisabled}
                        />
                    </div>
                }
                </Paper>

                <Button variant="contained"
                        style={{width: "200px", margin: "auto"}}
                        size="large"
                        onClick={handleStartPressed}
                        disabled={realNumCards === 0}
                >Start</Button>
            </div>
        </div>
    )
}