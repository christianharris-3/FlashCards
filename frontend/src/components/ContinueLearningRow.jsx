import {Box, Card, Divider, Typography} from "@mui/material";
import TimeAgo from "react-timeago";
import {useNavigate} from "react-router-dom";

export default function ContinueLearningRow({continueLearningDataItem}) {
    const navigate = useNavigate();
    let fillPercent = Math.floor(continueLearningDataItem.cardsDone / continueLearningDataItem.totalCards * 100)

    const style = {
        border: '1px solid',
        borderColor: '#cfc9bc',
        backgroundColor: 'background.paper',
    };

    function handlePress() {
        navigate(`/learn/${continueLearningDataItem.learningInstanceId}`)
    }


    return (
        <Card style={{display: "flex", justifyContent: "center"}} sx={style} onClick={handlePress}>
            <TimeAgo date={continueLearningDataItem.startedTimestamp}
                     style={{minWidth: "100px", padding: "6px"}} noWrap/>
            <Divider orientation="vertical" flexItem/>
            <Typography style={{minWidth: "50px", maxWidth: "400px", flexGrow: 1, padding: "6px"}} noWrap>
                {continueLearningDataItem.collectionName}
            </Typography>
            <Divider orientation="vertical" flexItem/>
            <Typography style={{minWidth: "50px", maxWidth: "100px", padding: "6px"}} noWrap>
                {continueLearningDataItem.learningType}
            </Typography>
            <Divider orientation="vertical" flexItem/>
            <div style={{minWidth: "50px", width: "200px", padding: "3px", borderRadius: "4px"}}>
                <Box sx={{width: `${fillPercent}%`, height: "100%", bgcolor: "primary.main", borderRadius: "4px", paddingLeft: "4px"}}>
                    <Typography style={{textAlign: "left", verticalAlign: "middle", padding: "4px"}}>
                        {continueLearningDataItem.cardsDone}/{continueLearningDataItem.totalCards}
                    </Typography>
                </Box>
            </div>
        </Card>
    )
}