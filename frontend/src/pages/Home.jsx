import {useNavigate} from "react-router-dom";
import {Alert, Button, Chip, CircularProgress, Paper, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {getHeaders, validateResponse} from "../utils/utils.js";
import ContinueLearningRow from "../components/ContinueLearningRow.jsx";

export default function Home() {
    const navigate = useNavigate();
    let loggedIn = false;

    const [continueLearningData, setContinueLearningData] = useState(null);


    if (localStorage.getItem("loggedIn") === "true") {
        loggedIn = true;
    }

    useEffect(() => {
        fetch("/api/learn", {
            method: "GET",
            headers: getHeaders()
        }).then(r => {
            if (validateResponse(r, navigate)) {
                r.json().then(json => {
                    setContinueLearningData(json);
                    console.log(json)
                })
            }
        })
    }, []);


    return (
        <div className="page" >
            <div className="page-items-container">
                <Paper style={{textAlign: "center", maxWidth: "800px", padding: "40px"}}>
                    <Typography variant="h2" style={{fontFamily: "Georgia", fontWeight: "bold", marginBottom: "30px"}}>
                        Flash Cards
                    </Typography>
                    <Typography variant="body" style={{fontFamily: "Source Sans 3"}}>
                        Just some flash cards idk
                    </Typography>

                    {loggedIn ?
                        <div style={{margin: "20px", display: "flex", justifyContent: "center", gap: "20px"}}>
                            <Button variant="outlined"
                                    style={{width: "130px"}}
                                    onClick={() => {
                                        navigate("/collections")
                                    }}>
                                Create+View Collections
                            </Button>
                            <Button variant="contained"
                                    style={{width: "130px"}}
                                    onClick={() => {
                                        navigate("/learn")
                                    }}>
                                Learn
                            </Button>


                        </div> :
                        <div style={{margin: "20px"}}>
                            <Button variant="contained"
                                    style={{margin: "10px"}}
                                    onClick={() => {
                                        navigate("/login")
                                    }}>
                                Sign In
                            </Button>
                            <Button variant="outlined"
                                    style={{margin: "10px"}}
                                    onClick={() => {
                                        navigate("/register")
                                    }}>
                                Register
                            </Button>
                        </div>
                    }
                </Paper>
                <Paper style={{padding: "20px"}}>
                    <Typography variant="h4" style={{paddingBottom: "10px"}}>
                        Continue
                    </Typography>
                    {continueLearningData === null ?
                        <CircularProgress /> :
                        <div style={{display: "flex", gap: "10px", flexDirection: "column"}}>
                            {continueLearningData.map((item) =>
                            <ContinueLearningRow continueLearningDataItem={item}/>)}
                        </div>
                    }
                </Paper>
            </div>
        </div>
    )
}