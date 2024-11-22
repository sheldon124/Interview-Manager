import {
  Stack,
  Typography,
  TableContainer,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Box,
  TablePagination,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

// Define types for Table Head columns
type AlignType =
  | "right"
  | "left"
  | "center"
  | "inherit"
  | "justify"
  | undefined;

interface TableHeadItem {
  id: string;
  tooltip: string;
  align: AlignType;
}

// Define the props type for the CustomTable component
interface CustomTableProps {
  TABLE_HEAD: TableHeadItem[];
  title?: string;
  columnOrder?: string[];
  data: any[];
  AlignRightTableCell?:
    | ((props: { onClick: () => void }) => JSX.Element)
    | null;
  primaryButton?: JSX.Element;
  rightCellClickHandler?: (row: any) => void;
  rowClickHandler?: (row: any) => void;
  footerTitle?: string;
  footerValue?: string;
  mtCustom?: number;
  onDeleteRow?: (row: any) => void; // Add a prop for handling row deletion
}

export default function CustomTable({
  TABLE_HEAD,
  title = "",
  columnOrder,
  data,
  AlignRightTableCell = null,
  primaryButton = <></>,
  rightCellClickHandler = () => {},
  rowClickHandler = () => {},
  footerTitle = "",
  footerValue = "",
  mtCustom = 5,
  onDeleteRow = () => {}, // Default handler
}: CustomTableProps) {
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default number of rows per page

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle change in rows per page
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  // Slice the data based on the current page and rows per page
  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 0, mt: mtCustom, marginRight: "50px", marginLeft: 0 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        {primaryButton}
      </Stack>
      <Card elevation={3}>
        <TableContainer
          sx={{
            width: 900,
            height: "400px",
            overflow: "auto",
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {TABLE_HEAD.map(({ id, tooltip, align }, i) =>
                  tooltip !== "" ? (
                    <TableCell align={align} key={i} sx={{ px: 1 }}>
                      <Stack direction="row" spacing={3}>
                        <Typography>{id}</Typography>
                        <Tooltip title={tooltip} placement="top">
                          <InfoIcon fontSize="small" />
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  ) : (
                    <TableCell align={align} key={i} sx={{ px: 1 }}>
                      <Typography>{id}</Typography>
                    </TableCell>
                  )
                )}
                {/* Remove the text "Delete" and make the column smaller */}
                <TableCell align="center" sx={{ width: 50 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, i) => (
                <TableRow
                  key={i}
                  onClick={() => rowClickHandler && rowClickHandler(row)}
                  hover
                >
                  {columnOrder &&
                    columnOrder.map((key) => (
                      <TableCell align="left" key={key} sx={{ px: 1 }}>
                        {key === "interviewer" && row[key] === "" ? (
                          <span style={{ color: "red" }}>(Unassigned)</span>
                        ) : key === "additional_notes" ? (
                          <span
                            style={{
                              display: "inline-block", // Ensures it respects width constraints
                              maxWidth: "80px", // Use the inherited default width
                              overflow: "hidden", // Hide overflowing content
                              textOverflow: "ellipsis", // Show "..." for truncated content
                              whiteSpace: "nowrap", // Prevent line wrapping
                            }}
                            title={row[key]} // Optional: Show full text on hover
                          >
                            {row[key]}
                          </span>
                        ) : (
                          row[key]
                        )}
                      </TableCell>
                    ))}
                  {AlignRightTableCell && (
                    <TableCell sx={{ px: 1 }} align="right">
                      <AlignRightTableCell
                        onClick={() => rightCellClickHandler(row)}
                      />
                    </TableCell>
                  )}
                  {/* Add the Delete icon button in the last TableCell */}
                  <TableCell align="center" sx={{ width: 50, px: 1 }}>
                    <Tooltip title="Delete" placement="top">
                      <DeleteIcon
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click event from firing
                          onDeleteRow(row); // Call the delete handler
                        }}
                        sx={{
                          cursor: "pointer",
                          fontSize: 20, // Adjust icon size if needed
                          marginLeft: "-20px",
                        }}
                      />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={data.length} // Total number of rows
          page={page} // Current page
          onPageChange={handleChangePage} // Handle page change
          rowsPerPage={rowsPerPage} // Rows per page
          onRowsPerPageChange={handleChangeRowsPerPage} // Handle rows per page change
          rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
          sx={{
            ".MuiTablePagination-toolbar": {
              minHeight: "36px",
            },
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
              {
                fontSize: "0.875rem",
              },
            ".MuiTablePagination-select": {
              fontSize: "0.875rem",
            },
            ".MuiTablePagination-actions": {
              marginBottom: "0px",
            },
          }}
        />
      </Card>
      {footerTitle && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            mt: 3,
          }}
        >
          <Typography variant="h5">{`${footerTitle}: ${footerValue}`}</Typography>
        </Box>
      )}
    </Box>
  );
}
