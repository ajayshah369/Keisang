import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridSortItem,
  GridRenderCellParams,
  GridTreeNodeWithRender,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";
import axiosInstance from "../utilities/axiosInstance";
import useApi from "../hooks";

type PaginationType = {
  limit: number;
  page: number;
  total: number;
};
type HistoryLogType = GridValidRowModel & {
  date: string;
  new_inventory: number | null;
  new_total_msrp: number | null;
  new_average_msrp: number | null;
  used_inventory: number | null;
  used_total_msrp: number | null;
  used_average_msrp: number | null;
  cpo_inventory: number | null;
  cpo_total_msrp: number | null;
  cpo_average_msrp: number | null;
};

const transformAmountRenderCell = (
  params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
) => {
  return params.value && `$${(+params.value).toLocaleString("en-US")}`;
};

const columns: GridColDef[] = [
  {
    field: "date",
    headerName: "DATE",
    width: 120,
    renderCell: (params) => {
      return new Date(params.value as string).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "2-digit",
      });
    },
  },

  { field: "new_inventory", headerName: "NEW INVENTORY", width: 150 },
  {
    field: "new_total_msrp",
    headerName: "NEW TOTAL MSRP",
    width: 180,
    renderCell: transformAmountRenderCell,
  },
  {
    field: "new_average_msrp",
    headerName: "NEW AVERAGE MSRP",
    width: 180,
    renderCell: transformAmountRenderCell,
  },

  { field: "used_inventory", headerName: "USED INVENTORY", width: 150 },
  {
    field: "used_total_msrp",
    headerName: "USED TOTAL MSRP",
    width: 180,
    renderCell: transformAmountRenderCell,
  },
  {
    field: "used_average_msrp",
    headerName: "USED AVERAGE MSRP",
    width: 180,
    renderCell: transformAmountRenderCell,
  },

  { field: "cpo_inventory", headerName: "CPO INVENTORY", width: 150 },
  {
    field: "cpo_total_msrp",
    headerName: "CPO TOTAL MSRP",
    width: 180,
    renderCell: transformAmountRenderCell,
  },
  {
    field: "cpo_average_msrp",
    headerName: "CPO AVERAGE MSRP",
    width: 180,
    renderCell: transformAmountRenderCell,
  },
];

const DataGridTable: React.FC = () => {
  const { selectedDealer, selectedBrands, selectedDurations } = useApi();
  const [sort, setSort] = useState<GridSortItem>({
    field: "date",
    sort: "asc",
  });
  const [pagination, setPagination] = useState<PaginationType>({
    limit: 10,
    page: 1,
    total: 0,
  });
  const [rows, setRows] = useState<HistoryLogType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = (
    page: number = 0,
    limit: number = 10,
    sortingData: GridSortItem = sort
  ) => {
    setLoading(true);
    axiosInstance
      .get<{
        sort: GridSortItem;
        pagination: PaginationType;
        data: HistoryLogType[];
      }>("/admin/vehicles/history-log", {
        params: {
          page,
          limit,
          field: sortingData.field,
          sort: sortingData.sort,
          dealer: selectedDealer,
          brands: Object.keys(selectedBrands),
          durations: Object.keys(selectedDurations),
        },
      })
      .then((res) => {
        setRows(res.data.data);
        setPagination(res.data.pagination);
        setSort(res.data.sort);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [selectedDealer, selectedBrands, selectedDurations]);

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    fetchData(model.page, model.pageSize);
  };

  const handleSortModelChange = (model: GridSortModel) => {
    console.log(model[0]);
    if (model.length > 0) {
      fetchData(pagination.page, pagination.limit, model[0]);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.date}
        pagination={true}
        paginationMode='server'
        rowCount={pagination.total}
        pageSizeOptions={[5, 10, 15]}
        paginationModel={{
          page: pagination.page,
          pageSize: pagination.limit,
        }}
        onPaginationModelChange={handlePaginationModelChange}
        sx={{ border: "none", backgroundColor: "#fff" }}
        sortModel={[sort]}
        onSortModelChange={handleSortModelChange}
      />
    </Box>
  );
};

export default DataGridTable;
