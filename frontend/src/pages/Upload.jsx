import {useState} from "react";

export default function Upload() {

    const [zipFile, setZipFile] = useState(null);


    const handleFileChange = (event) => {
        setZipFile(event.target.files[0]);
    }
    const handleFileCollection = () => {
        const formData = new FormData();
        formData.set("file", zipFile);

        fetch("api/collections/upload", {
            method: "POST",
            body: formData
        }).then(r => console.log("res: ", r))
    }

    return (
        <div className="page">
            <input type="file" accept=".zip" onChange={handleFileChange} />
            <button onClick={handleFileCollection}> Collection </button>
        </div>
    )
}