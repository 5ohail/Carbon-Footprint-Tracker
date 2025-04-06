import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const styles = {
  fontBold: {
    fontWeight: "bold",
    fontSize: "1rem",
    textAlign: "center",
  },
  cell: {
    textAlign: "center",
    borderRight: "1px solid rgba(224, 224, 224, 1)", // Adds a vertical line between columns
  },
  lastCell: {
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0066cc",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  },
  flexContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
  },
};

const CarbonFootprintTable = ({ heading, readings, date, serialNum, data }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const handleNextPage = () => {
    if ((page + 1) * rowsPerPage < data.length) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow >
              <TableCell style={{ ...styles.fontBold, ...styles.cell }}>{serialNum}</TableCell>
              <TableCell style={{ ...styles.fontBold, ...styles.cell }}>{heading}</TableCell>
              <TableCell style={{ ...styles.fontBold, ...styles.cell }}>{readings}</TableCell>
              <TableCell style={{ ...styles.fontBold, ...styles.cell }}>{date}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((row, index) => (
              <TableRow key={index}>
                <TableCell style={styles.cell}>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell style={styles.cell}>{row.activity}</TableCell>
                <TableCell style={styles.cell}>{row.co2Emitted}</TableCell>
                <TableCell style={styles.lastCell}>{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={styles.flexContainer} className="w-full">
        <button style={styles.button} onClick={handlePrevPage} disabled={page === 0}>
          Previous
        </button>
        <button style={styles.button} onClick={handleNextPage} disabled={(page + 1) * rowsPerPage >= data.length}>
          Next
        </button>
      </div>
    </>
  );
};

export default CarbonFootprintTable;