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
import UploadSection from "../components/UploadSection.jsx";
import {useEffect, useState} from "react";
import EditableText from "../components/EditableText.jsx";
import DeleteCollection from "../components/DeleteCollection.jsx";

export default function Profile() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("loggedIn") !== "true") {
            navigate("/login")
        }
    })

    function logoutPressed() {
        logout()
        navigate("/")
    }




    return (
        <div className="page">
            <div style={{paddingTop: "30px"}}>
                <div className="page-items-container">
                    <Paper style={{flexGrow: 1, display: "flex", padding: "30px", flexWrap: "wrap", justifyContent: "center"}}>
                        <UserAvatar username={localStorage.getItem("username")} sx={{width: 200, height: 200, fontSize: 80, marginRight: "40px"}}/>
                        <Divider orientation="vertical" flexItem/>
                        <div style={{padding: "30px", flexBasis: "400px"}}>
                            <Typography variant="h3">Welcome, {localStorage.getItem("username")}</Typography>
                            <Typography variant="body">No, I'm not going to let you collection a profile picture, I haven't figured out how to store that yet.</Typography>
                            <br></br>
                            <Button variant="outlined" style={{marginTop: "20px"}} onClick={logoutPressed}>Logout</Button>
                        </div>
                    </Paper>
                </div>
            </div>
        </div>
    )
}