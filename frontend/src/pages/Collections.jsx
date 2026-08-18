import {
    Button, Checkbox,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TableRow,
    Typography
} from "@mui/material";
import {getHeaders, getHeadersJson} from "../utils/utils.js";
import {useNavigate} from "react-router-dom";
import UploadSection from "../components/UploadSection.jsx";
import {useEffect, useState} from "react";
import EditableText from "../components/EditableText.jsx";
import DeleteCollection from "../components/DeleteCollection.jsx";

export default function Collections() {
    const navigate = useNavigate();
    const [collectionItems, setCollectionItems] = useState(null);
    const [triggerDataReload, setTriggerDataReload] = useState(1);
    const [selectedCollection, setSelectedCollection] = useState(null);

    useEffect(() => {
        fetch("/api/collections", {
            method: "GET",
            headers: getHeaders()
        }).then(r => r.json()).then(json => {
            if (json.length > 0) {
                setSelectedCollection(json[0].collectionId);
            }
            setCollectionItems(Object.fromEntries(
                json.map(item => [item.collectionId, item])
            ));
        });
    }, [triggerDataReload]);

    useEffect(() => {
        if (selectedCollection !== null && selectedCollection !== undefined) {
            localStorage.setItem("activeCollectionId", selectedCollection.toString())
            fetch("/api/collections/select/"+selectedCollection, {
                method: "POST",
                headers: getHeaders()
            }).then()
        }
    }, [selectedCollection]);

    function runTriggerDataReload() {
        setTriggerDataReload(triggerDataReload + 1);
    }

    function collectionSelected(collectionId) {
        setSelectedCollection(collectionId);
    }

    function saveTitle(newCollectionName, row) {
        return fetch("/api/collections/"+row.collectionId, {
            method: "PUT",
            headers: getHeadersJson(),
            body: JSON.stringify({collectionName: newCollectionName})
        }).then(r => {
            if (validateResponse(r, navigate)) {
                row.collectionName = newCollectionName;
                return true;
            } else {
                console.log("failed to edit title", r);
                return false;
            }
        })
    }

    return (
        <div className="page">
            <div style={{textAlign: "center", maxWidth: "800px", margin: "auto", padding: "40px"}}>
                <Paper style={{padding: "10px"}}>
                    <Typography sx={{margin: "20px"}} variant="h5">Upload Your Collection</Typography>
                    <Typography variant="body" style={{marginTop: "10px"}}>
                        Your data should be an excel file with 2 columns, left for english, right for
                        polish.
                    </Typography>
                    <UploadSection triggerDataReload={runTriggerDataReload}/>
                </Paper>
                <div style={{paddingTop: "30px"}}>
                    <Paper style={{padding: "10px"}}>
                        <Typography variant="h5">Your Collections</Typography>
                        {collectionItems === null ?
                            <div>Loading...</div> :
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{background: ""}}>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell style={{width: "100px"}} align="center">Items</TableCell>
                                            <TableCell style={{width: "100px"}} align="center">View</TableCell>
                                            <TableCell style={{width: "100px"}} align="center">Delete</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.values(collectionItems).map((row) => (
                                            <TableRow hover key={row.collectionId}>
                                                <TableCell sx={{padding: "1px", paddingTop: "8px", width: "270px"}}>
                                                    <EditableText row={row}
                                                                  defaultText={row.collectionName}
                                                                  saveFunc={saveTitle}
                                                                  htmlKey={row.collectionId}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">{row.itemCount}</TableCell>
                                                <TableCell align="center">
                                                    <Button variant="outlined" onClick={() => navigate(`/collections/${row.collectionId}`)}>View</Button>
                                                </TableCell>
                                                <TableCell sx={{width: "50px"}} align="center">
                                                    <DeleteCollection collectionId={row.collectionId}
                                                                      triggerDataReload={runTriggerDataReload}/>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        }
                    </Paper>
                </div>
            </div>
        </div>
    )
}