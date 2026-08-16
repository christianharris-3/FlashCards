import {
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography
} from "@mui/material";
import {getHeaders} from "../utils/utils.js";
import FlashCard from "../components/FlashCard/FlashCard.jsx";
import {useEffect, useState} from "react";
import FlashCardDeck from "../components/FlashCardDeck.jsx";
import Selector from "../components/Selector/Selector.jsx";
import {useNavigate} from "react-router-dom";

export default function LearnStartPage() {
    const navigate = useNavigate();
    const LearnTypes = ["Daily", "Random"]
    const [selectedLearnType, setSelectedLearnType] = useState(LearnTypes[0]);

    const [collectionList, setCollectionList] = useState(null);
    const [collectionSelected, setCollectionSelected] = useState(null);

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
        navigate(`/learn/${selectedLearnType.toLowerCase()}/${collectionSelected}`)
    }


    return (
        <div className="page">
            <div style={{
                textAlign: "center", maxWidth: "700px", margin: "auto",
                padding: "40px", display: "flex", gap: "20px", flexDirection: "column"
            }}>
                <Typography variant="h4">
                    Practice Collection
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
                <Selector items={LearnTypes}
                          selectedValue={selectedLearnType}
                          setSelectedValue={setSelectedLearnType}
                />
                <Button variant="contained"
                        style={{width: "200px", margin: "auto"}}
                        size="large"
                        onClick={handleStartPressed}
                >Start</Button>
            </div>
        </div>
    )
}