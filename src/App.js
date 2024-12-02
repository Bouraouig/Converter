import logo from "./logo.svg";
import "./App.css";
import { IconButton } from "rsuite";
import FileUploadIcon from "@rsuite/icons/FileUpload";
import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import { ExcelModel } from "./Model";
import ReactExport from "react-export-excel";
import FileDownloadIcon from "@rsuite/icons/FileDownload";
import Swal from "sweetalert2";

function App() {
  const [data, setdata] = useState();
  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
  const handleFileUpload = (e) => {
    console.log(e.target.files);
    const file = e.target.files[1];
    const file2 = e.target.files[0];
    if (!file.name.endsWith(".xls") && !file.name.endsWith(".xlsx")) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${file.name} is not excel`,
      });
    } else if (!file2.name.endsWith(".xls") && !file2.name.endsWith(".xlsx")) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${file2.name} is not excel`,
      });
    } else {
      const reader = new FileReader();
      const reader_file2 = new FileReader();
      let d = [];

      reader.onload = (event) => {
        const workbook = XLSX.read(event.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        sheetData.shift();

        sheetData.map((element, index) => {
          d.push(new ExcelModel());
          d[index]["passportNumber"] = element["_2"];
          d[index]["nationality"] = element["_3"];
          d[index]["dateOfBirth"] = element["_4"];
          d[index]["gender"] = element["_5"] == "ذكر" ? "M" : "F";
          d[index]["firstName"] = element["_9"];
          d[index]["middleName"] = element["_7"];
          d[index]["lastName"] = element["_8"];
          d[index]["paxInPNR"] = element["_11"];
        });
      };
      reader_file2.onload = (event) => {
        const workbook = XLSX.read(event.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        sheetData.shift();
        sheetData.shift();
        sheetData.map((element, index) => {
          let x = d.filter(
            (el) => el["passportNumber"] == element["__EMPTY_10"]
          );
          let el = d[d.indexOf(x[0])];
          el["expirationDate"] = element["__EMPTY_4"];
          el["groupsEntry"] = `NM1${el.lastName}/${el.firstName} ${
            el.middleName
          } ${el.gender == "M" ? "MR" : "MRS"};`;
          el["ctoEntry"] = `SRDOCSSVHK1-P-LBY-${el.passportNumber}/LBY-${
            el.dateOfBirth
          }/${el.gender}/${element["__EMPTY_4"]}/${el.lastName}/${
            el.firstName
          }${el.middleName}/P${index + 1}`;
        });
      };

      setdata(d);
      reader.readAsBinaryString(file);
      reader_file2.readAsBinaryString(file2);
    }
  };

  return (
    <div className="App" style={{ textAlign: "center" }}>
      <div>
        <h1 style={{ fontSize: 80, height: "15vh", padding: 15 }}>
          <span style={{ color: "#4834d4" }}>Taysir</span>
          <span style={{ color: "#535c68" }}>Solutions</span>
        </h1>
      </div>
      <div>
        {!data && (
          <div style={{ position: "relative" }}>
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
              onChange={(e) => (e ? handleFileUpload(e) : "")}
            />

            <IconButton
              icon={<FileUploadIcon />}
              appearance="primary"
              color="green"
            >
              Upload file
            </IconButton>
          </div>
        )}
        {data && (
          <ExcelFile
            filename="MyExportedData"
            element={
              <IconButton
                icon={<FileDownloadIcon />}
                appearance="primary"
                color="green"
              >
                Dowload file
              </IconButton>
            }
          >
            <ExcelSheet data={data} name="Employees">
              <ExcelColumn label="Passport Number" value="passportNumber" />
              <ExcelColumn label="Date of birth" value="dateOfBirth" />
              <ExcelColumn label="Gender" value="gender" />
              <ExcelColumn label="Date of expired" value="expirationDate" />
              <ExcelColumn label="Last Name" value="lastName" />
              <ExcelColumn label="First Name" value="firstName" />
              <ExcelColumn label="Middle name" value="middleName" />
              <ExcelColumn label="paxInPNR" value="paxInPNR" />
              <ExcelColumn label="Groups Entry" value="groupsEntry" />
              <ExcelColumn label="CTO entry" value="ctoEntry" />
            </ExcelSheet>
          </ExcelFile>
        )}
      </div>

      {data && (
        <div style={{ width: "80%", margin: "auto" }}>
          <table>
            <thead>
              <tr>
                {data.length > 0 &&
                  Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((cell, idx) => (
                    <td key={idx}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
