import {useNavigate} from "react-router-dom";
import {Alert, Button, Chip, CircularProgress, Paper, Typography} from "@mui/material";

export default function Home() {
    const navigate = useNavigate();
    let loggedIn = false;


    if (localStorage.getItem("loggedIn") === "true") {
        loggedIn = true;
    }


    return (
        <div className="page">
            <div style={{paddingTop: "30px"}}>
                <Paper style={{textAlign: "center", width: "800px", margin: "auto", padding: "40px"}}>
                    <Typography variant="h2" style={{fontFamily: "Georgia", fontWeight: "bold", marginBottom: "30px"}}>
                        Flash Cards
                    </Typography>
                    <Typography variant="body" style={{fontFamily: "Source Sans 3"}}>
                        Just some flash cards idk
                    </Typography>

                    {loggedIn ?
                        <div style={{margin: "20px"}}> </div> :
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
            </div>
        </div>
    )
}