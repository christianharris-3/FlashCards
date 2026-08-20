import "./SimpleThreeItemBarChart.css";
import {Box, Typography} from "@mui/material";


export default function SimpleThreeItemBarChart({goodHeight, okayHeight, badHeight}) {

    let totalHeight = Math.max(goodHeight, okayHeight, badHeight);

    let goodHeightPercent = `${Math.floor(goodHeight/totalHeight*100)}%`;
    let okayHeightPercent = `${Math.floor(okayHeight/totalHeight*100)}%`;
    let badHeightPercent = `${Math.floor(badHeight/totalHeight*100)}%`;

    return (
        <div className="parentContainer">
            <div className="graphContainer">
                <div>
                    <Typography variant="h6">
                        Correct Answers
                    </Typography>
                </div>
                <div className="barContainer">
                    <div className="barContainerFr">
                        <div className="individualBarContainer">
                            <Box sx={{bgcolor: "primary.main", height: goodHeightPercent}} className="verticalBar" />
                            <Box sx={{height: goodHeightPercent}} className="graphItemTextContainer">
                                <Typography className="graphItemText">
                                    Good: {goodHeight}
                                </Typography>
                            </Box>
                        </div>
                        <div className="individualBarContainer">
                            <Box sx={{bgcolor: "info.main", height: okayHeightPercent}} className="verticalBar" />
                            <Box sx={{height: okayHeightPercent}} className="graphItemTextContainer">
                                <Typography className="graphItemText">
                                    Okay: {okayHeight}
                                </Typography>
                            </Box>
                        </div>
                        <div className="individualBarContainer">
                            <Box sx={{bgcolor: "error.main", height: badHeightPercent}} className="verticalBar" />
                            <Box sx={{height: badHeightPercent}} className="graphItemTextContainer">
                                <Typography className="graphItemText">
                                    Bad: {badHeight}
                                </Typography>
                            </Box>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}