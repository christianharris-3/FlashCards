import {useParams} from "react-router-dom";
import {getHeaders, msPlayedToString} from "../utils/utils.js";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow, Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import FlashCardRow from "../components/FlashCardRow.jsx";

export default function ViewCollection() {
    const {collectionId} = useParams();
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [collectionData, setCollectionData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(25);

    useEffect(() => {
        fetch(`/api/collections/${collectionId}`, {
            method: "GET",
            headers: getHeaders()
        }).then(r => {
            if (r.ok) {
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
        setReloadTrigger(x => x+1)
    }


    return (
        <div className="page">
            <div style={{textAlign: "center", maxWidth: "800px", margin: "auto", padding: "40px"}}>
                <Paper style={{flexGrow: 1, padding: "30px"}}>
                    <div>
                        <Typography variant="h5">
                                {collectionData.collectionName}
                        </Typography>
                    </div>

                    {collectionData !== null &&
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
                                        {collectionData.flashCards.slice((currentPage) * pageSize, (currentPage + 1) * pageSize).map(
                                            (row) => (
                                                <FlashCardRow row={row} triggerReload={triggerReload} reloadKey={reloadTrigger}/>
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
                        </div>}
                </Paper>
            </div>
        </div>
    )
}