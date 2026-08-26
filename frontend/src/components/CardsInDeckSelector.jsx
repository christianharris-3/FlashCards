import {FormControl, InputLabel, MenuItem, Paper, Select, Slider, Typography} from "@mui/material";
import {useState} from "react";

export default function CardsInDeckSelector() {
    const [numCards, setNumCards] = useState("100")
    const numCardsOptions = ["25", "50", "100", "200", "All", "Custom"]



    function handChangeNumCards(event) {
        setNumCards(event.target.value)
        if (event.target.value === "All") {
            setRangeSliderValue([0, totalCards])
            setRangeSliderDisabled(true);
        } else {
            setRangeSliderDisabled(false);
            if (event.target.value !== "Custom") {
                clampRangeSliderDefault(rangeSliderValue, 0, parseInt(event.target.value));
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
            clampRangeSliderDefault(value, activeThumb, intNumCards)
        }
    }

    function handleChangeRange(event, value) {
        setRangeSliderValue([value, rangeSliderValue[1]])
    }




    return (
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
    )
}