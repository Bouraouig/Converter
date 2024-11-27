import logo from "./logo.svg";
import "./App.css";
import { IconButton } from "rsuite";
import FileUploadIcon from "@rsuite/icons/FileUpload";
import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import { ExcelModel } from "./Model";

function App() {
  const [ok, setdata] = useState([]);
  const handleFileUpload = (e) => {
    // console.log(e.target.files);
    const file = e.target.files[1];
    const file2 = e.target.files[0];
    const reader = new FileReader();
    const reader_file2 = new FileReader();
    let data = [];

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      
      sheetData.map((element, index) => {
        data.push(new ExcelModel());
        data[index]["passportNumber"] = element["_2"];
        data[index]["nationality"] = element["_3"];
        data[index]["dateOfBirth"] = element["_4"];
        data[index]["gender"] = element["_5"];
        data[index]["firstName"] = element["_9"];
        data[index]["middleName"]=element["_7"]
        data[index]["lastName"] = element["_8"];
        data[index]["paxInPNR"] = element["_11"];
      });
    };
    // console.log("data",data)
    reader_file2.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      // console.log(sheetData)
       sheetData.shift()
      console.log("shetdata",sheetData)
      sheetData.map(element=>{

        let x= data.filter(el=>el["passportNumber"]==element["__EMPTY_10"])
        data[data.indexOf(x[0])]["expirationDate"]=element["__EMPTY_4"]
      })
    };
    console.log("data",data)
    setdata(data);   

    reader.readAsBinaryString(file);
    reader_file2.readAsBinaryString(file2);
  };
  // useEffect(() => console.log(data), [data]);
  return (
    <div className="App" style={{ textAlign: "center" }}>
      <div>
        <h1 style={{ fontSize: 80, height: "15vh", padding: 15 }}>
          <span style={{ color: "#4834d4" }}>Taysir</span>
          <span style={{ color: "#535c68" }}>Solutions</span>
        </h1>
      </div>
      <span style={{ position: "relative" }}>
        <input
          type="file"
          multiple
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: 100,
            opacity: 0,
          }}
          onChange={(e) => e? handleFileUpload(e):""}
        />

        <IconButton
          icon={<FileUploadIcon />}
          appearance="primary"
          color="green"
        >
          Upload file
        </IconButton>
      </span>
    </div>
  );
}

export default App;
