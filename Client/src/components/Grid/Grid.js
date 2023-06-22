import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const Grid = ({column,row}) => {
  return (
    <>
      <DataGrid
        columns={column}
        rows={row}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </>
  );
};

export default Grid;
