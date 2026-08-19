import {useNavigate, useParams} from "react-router-dom";
import {getHeaders, getHeadersJson, msPlayedToString, validateResponse} from "../utils/utils.js";
import {
    Button,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow, TextField, Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import FlashCardRow from "../components/FlashCardRow.jsx";

export default function ViewCollection() {
    const navigate = useNavigate();
    const {collectionId} = useParams();
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [collectionData, setCollectionData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(25);
    const [newFlashCardFrontText, setNewFlashCardFrontText] = useState("");
    const [newFlashCardBackText, setNewFlashCardBackText] = useState("");

    useEffect(() => {
        fetch(`/api/collections/${collectionId}`, {
            method: "GET",
            headers: getHeaders()
        }).then(r => {
            if (validateResponse(r, navigate)) {
                r.json().then(json => {
                    setCollectionData(json);
                })
            }
        })
    }, [reloadTrigger]);

    function changePage(event, newPage) {
        setCurrentPage(newPage);
    }

    const handleChangePageSize = (event) => {
        setCurrentPage(0);
        setPageSize(parseInt(event.target.value, 10))
    }

    function triggerReload() {
        setReloadTrigger(x => x + 1)
    }

    function handleCreateFlashCard() {
        fetch("/api/flashcard", {
            method: "POST",
            headers: getHeadersJson(),
            body: JSON.stringify({
                collectionId: collectionId,
                frontText: newFlashCardFrontText,
                backText: newFlashCardBackText
            })
        }).then(r => {
            if (validateResponse(r, navigate)) {
                triggerReload()
            }
        })
    }


    return (
        <div className="page">
            <div style={{textAlign: "center", maxWidth: "800px", margin: "auto", padding: "40px", display: "flex", flexDirection: "column", gap: "20px"}}>
                <Paper style={{flexGrow: 1, padding: "30px"}}>
                    <div>
                        {collectionData !== null ?
                            <Typography variant="h4">
                                {collectionData.collectionName}
                            </Typography> :
                            <CircularProgress />
                        }
                    </div>
                </Paper>
                <Paper style={{padding: "10px", paddingBottom: "20px"}}>
                    <Typography sx={{margin: "10px"}} variant="h5">Add Flash Card</Typography>
                    <div style={{display: "flex", gap: "20px", justifyContent: "center"}}>
                        <TextField size="small"
                                   label="English"
                                   onChange={(e) => {
                                       setNewFlashCardFrontText(e.target.value)
                                   }}/>
                        <TextField size="small"
                                   label="Polish"
                                   onChange={(e) => {
                                       setNewFlashCardBackText(e.target.value)
                                   }}/>
                        <Button variant="outlined" onClick={handleCreateFlashCard}>Create</Button>
                    </div>
                </Paper>
                <Paper style={{flexGrow: 1, padding: "20px"}}>
                    {collectionData !== null ?
                        <div>
                            <div style={{width: "100%"}}>
                                <TableContainer>
                                    <Table className="mainTable">
                                        <TableHead style={{tableLayout: "fixed"}}>
                                            <TableRow className="titleRow">
                                                <TableCell sx={{width: "60px"}}>Index</TableCell>
                                                <TableCell sx={{width: "50%"}} align="center">English</TableCell>
                                                <TableCell sx={{width: "50%"}} align="center">Polish</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className="tableBody">
                                            {collectionData.flashCards.slice((currentPage) * pageSize,
                                                (currentPage + 1) * pageSize).map(
                                                (row) => (
                                                    <FlashCardRow row={row}
                                                                  triggerReload={triggerReload}
                                                                  reloadKey={reloadTrigger}
                                                                  key={row.flashCardId}
                                                    />
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <div style={{margin: "auto", width: "fit-content"}}>
                                    <TablePagination component="div"
                                                     count={collectionData.itemCount}
                                                     onPageChange={changePage}
                                                     page={currentPage}
                                                     rowsPerPage={pageSize}
                                                     onRowsPerPageChange={handleChangePageSize}
                                                     showFirstButton={true}
                                                     showLastButton={true}
                                    />
                                </div>
                            </div>
                        </div>:
                        <div>
                            <CircularProgress />
                        </div>
                    }
                </Paper>
            </div>
        </div>
    )
}