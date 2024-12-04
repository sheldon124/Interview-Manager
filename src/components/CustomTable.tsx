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
  mtCustom = 3,
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
    <Box sx={{ p: 0, mt: mtCustom, marginRight: "15px", marginLeft: 0 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        {primaryButton}
      </Stack>
      <Card elevation={3}>
        <TableContainer
          sx={{
            width: "1070px", // Full-width or use a higher value
            height: "515px", // Dynamic height based on content
            overflow: "auto", // Keep scrolling if content overflows
          }}
        >
          <Table stickyHeader size="medium">
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
              {paginatedData.map((row, i) => {
                // Check if the interview date is in the past
                const isPast = new Date(`${row.date}T${row.time}`) < new Date(); // Assuming row.date is in a parseable date format

                return (
                  <TableRow
                    key={i}
                    onClick={() => rowClickHandler && rowClickHandler(row)}
                    hover
                    sx={{
                      // Apply a "disabled" style if the interview date is in the past
                      opacity: isPast ? 0.5 : 1, // Faded appearance for past dates
                      backgroundColor: isPast ? "#f5f5f5" : "transparent", // Optional: Change the background color for past dates
                    }}
                  >
                    {columnOrder &&
                      columnOrder.map((key) => (
                        <TableCell align="left" key={key} sx={{ px: 1 }}>
                          {key === "interviewer" && row[key] === "" ? (
                            <span style={{ color: "red" }}>(Unassigned)</span>
                          ) : key === "additional_notes" ? (
                            <span
                              style={{
                                display: "inline-block",
                                maxWidth: "80px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                              title={row[key]}
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
                    {/* Delete icon button */}
                    <TableCell align="center" sx={{ width: 50, px: 1 }}>
                      <Tooltip title="Delete" placement="top">
                        <DeleteIcon
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteRow(row);
                          }}
                          sx={{
                            cursor: "pointer",
                            fontSize: 20,
                            marginLeft: "-20px",
                            color: isPast ? "gray" : "black", // Disable the delete icon for past rows
                          }}
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
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
