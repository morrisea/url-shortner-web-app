import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../utils/Button';
import Box from '@mui/material/Box';
import './DataGrid.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000',
      paper: '#000',
    },
  },
});

const domain = 'https://localhost:5173';
const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'address',
    headerName: 'URL',
    width: 350,
    editable: false,
    sortable: true,
  },
  {
    field: 'shortURL',
    headerName: 'Shortened URL',
    rowHeader: true,
    description: 'This column is the shortened URL to its respectively URL',
    sortable: true,
    width: 350,
    valueGetter: (value, row) => `${domain}/${row.redirect || ''}`,
  },
  {
    field: 'creationDate',
    headerName: 'Creation Date',
    width: 250,
    editable: false,
    sortable: true,
  },
];

export default function DataGridLinks() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { accessToken } = useAuth();
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [selectionModel, setSelectionModel] = useState({
    type: 'include',
    ids: new Set(),
  });

  useEffect(() => {
    async function fetchRows() {
      const res = await fetch(
        `${apiUrl}/links?page=${paginationModel.page}&pageSize=${paginationModel.pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = await res.json();

      setRows(data.rows);
      setRowCount(data.total);
    }

    fetchRows();
  }, [paginationModel, selectionModel, accessToken]);

  const handleDelete = async () => {
    const ids = [...selectionModel.ids];

    if (ids.length !== 1) return;

    const confirmed = window.confirm(
      'Are you sure you want to remove this saved URL?',
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`${apiUrl}/links/${ids[0]}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete URL');
      }

      setSelectionModel({
        type: 'include',
        ids: new Set(),
      });
    } catch (error) {
      console.error('Error deleting URL:', error);
    }
  };

  return (
    <section className='links-card'>
      <h1>Manage Links</h1>
      <div className='divide-line'></div>
      <br></br>
      <Box
        sx={{
          height: 400,
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
        }}
      >
        <ThemeProvider theme={darkTheme}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationMode='server'
            rowCount={rowCount}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={setSelectionModel}
            disableRowSelectionOnClick
          />
        </ThemeProvider>
        <div className='btn-container'>
          <Button
            disabled={selectionModel.ids.size === 0}
            onClick={handleDelete}
          >
            Delete selected ({selectionModel.ids.size})
          </Button>
        </div>
      </Box>
    </section>
  );
}
