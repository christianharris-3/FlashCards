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
import UserAvatar from "../components/UserAvatar.jsx";
import {getHeaders, logout} from "../utils/utils.js";
import {useNavigate} from "react-router-dom";
import CollectionSection from "../components/CollectionSection.jsx";
import {useEffect, useState} from "react";
import EditableText from "../components/EditableText.jsx";
import DeleteCollection from "../components/DeleteCollection.jsx";

export default function Profile() {
    const navigate = useNavigate();
    const [collectionItems, setCollectionItems] = useState(null);
    const [triggerDataReload, setTriggerDataReload] = useState(1);
    const [selectedCollection, setSelectedCollection] = useState(null);

    useEffect(() => {
        if (localStorage.getItem("loggedIn") !== "true") {
            navigate("/login")
        }
    })

    function logoutPressed() {
        logout()
        navigate("/")
    }

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

    function formatDate(unixTime) {
        if (unixTime === null) {
            return "Unknown"
        }
        let date = new Date(unixTime);
        let month = date.toLocaleString("en-gb", {month: "short"});
        return `${month} ${date.getFullYear()}`
    }

    function collectionSelected(collectionId) {
        setSelectedCollection(collectionId);
    }



    return (
        <div className="page">
            <div style={{paddingTop: "30px"}}>
                <div style={{textAlign: "center", maxWidth: "800px", margin: "auto", padding: "40px"}}>
                    <Paper style={{flexGrow: 1, display: "flex", padding: "30px"}}>
                        <UserAvatar username={localStorage.getItem("username")} sx={{width: 200, height: 200, fontSize: 80, marginRight: "40px"}}/>
                        <Divider orientation="vertical" flexItem/>
                        <div style={{padding: "30px"}}>
                            <Typography variant="h3">Welcome, {localStorage.getItem("username")}</Typography>
                            <Typography variant="body">No, I'm not going to let you collection a profile picture, I haven't figured out how to store that yet.</Typography>
                            <br></br>
                            <Button variant="outlined" style={{marginTop: "20px"}} onClick={logoutPressed}>Logout</Button>
                        </div>
                    </Paper>
                    <div style={{paddingTop: "30px"}}>
                        <Paper style={{padding: "10px"}}>
                            <Typography sx={{margin: "20px"}} variant="h5" >Collection Your Collection</Typography>
                            <Typography variant="body" style={{marginTop: "10px"}}>
                                Your data should be a csv/xls/xlsx file with 2 columns, left for english, right for polish.
                            </Typography>
                            <CollectionSection triggerDataReload={runTriggerDataReload}/>
                        </Paper>
                    </div>
                    <div style={{paddingTop: "30px"}}>
                        <Paper style={{padding: "10px"}}>
                            <Typography variant="h5">Your Collections</Typography>
                            {collectionItems === null ?
                                <div>Loading...</div>:
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{background: ""}}>
                                        <TableRow>
                                            <TableCell>Active</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Items</TableCell>
                                            <TableCell>Delete</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.values(collectionItems).map((row) => (
                                            <TableRow hover key={row.collectionId}>
                                                <TableCell>
                                                    <Checkbox checked={selectedCollection === row.collectionId} onClick={() => {collectionSelected(row.collectionId)}} size="large"/>
                                                </TableCell>
                                                <TableCell sx={{padding: "1px", paddingTop: "8px", width: "270px"}}>
                                                    <EditableText row={row} triggerDataReload={runTriggerDataReload}/>
                                                </TableCell>
                                                <TableCell>{row.itemCount}</TableCell>
                                                <TableCell sx={{width: "50px"}}>
                                                    <DeleteCollection collectionId={row.collectionId} triggerDataReload={runTriggerDataReload}/>
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
        </div>
    )
}