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
  footerTitle?: string;
  footerValue?: string;
  mtCustom?: number;
}

export default function CustomTable({
  TABLE_HEAD,
  title = "",
  columnOrder,
  data,
  AlignRightTableCell = null,
  primaryButton = <></>,
  rightCellClickHandler = () => {},
  footerTitle = "",
  footerValue = "",
  mtCustom = 5,
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
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {TABLE_HEAD.map(({ id, tooltip, align }, i) =>
                  tooltip !== "" ? (
                    <TableCell align={align} key={i}>
                      <Stack direction="row" spacing={3}>
                        <Typography>{id}</Typography>
                        <Tooltip title={tooltip} placement="top">
                          <InfoIcon fontSize="small" />
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  ) : (
                    <TableCell align={align} key={i}>
                      <Typography>{id}</Typography>
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, i) => (
                <TableRow key={i} hover>
                  {columnOrder &&
                    columnOrder.map((key) => (
                      <TableCell
                        align="left"
                        key={key}
                        sx={{
                          backgroundColor: !row.assigned
                            ? "#FFCCCB"
                            : "inherit",
                        }}
                      >
                        {row[key]}
                      </TableCell>
                    ))}
                  {AlignRightTableCell && (
                    <TableCell align="right">
                      <AlignRightTableCell
                        onClick={() => rightCellClickHandler(row)}
                      />
                    </TableCell>
                  )}
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
