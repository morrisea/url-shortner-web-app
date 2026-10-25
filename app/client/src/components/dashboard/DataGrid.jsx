import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useAuth } from '../../context/useAuth';
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
    width: 250,
    editable: false,
    sortable: true,
  },
  {
    field: 'shortURL',
    headerName: 'Shortened URL',
    rowHeader: true,
    description: 'This column is the shortened URL to its respectively URL',
    sortable: true,
    width: 300,
    valueGetter: (value, row) => `${domain}/${row.redirect || ''}`,
  },
  {
    field: 'redirect',
    headerName: 'Redirect Path',
    rowHeader: true,
    description: 'The path portion of the shortened URL',
    sortable: true,
    editable: true,
    width: 150,
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

  const fetchRows = async () => {
    const res = await fetch(
      `${apiUrl}/links?page=${paginationModel.page}&pageSize=${paginationModel.pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error('Failed to fetch links');
    }

    const data = await res.json();

    setRows(data.rows);
    setRowCount(data.total);
  };

  useEffect(() => {
    fetchRows().catch((error) => {
      console.error('Error fetching links:', error);
    });
  }, []);

  const processRowUpdate = async (updatedRow, originalRow) => {
    if (updatedRow.redirect === originalRow.redirect) {
      return updatedRow;
    }

    const res = await fetch(`${apiUrl}/links/${updatedRow.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        redirect: updatedRow.redirect,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to update redirect');
    }

    return updatedRow;
  };

  const handleDelete = async () => {
    const ids = [...selectionModel.ids];

    if (ids.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to remove ${ids.length} saved URL(s)?`,
    );

    let res;
    if (!confirmed) return;

    try {
      if (ids.length === 1) {
        res = await fetch(`${apiUrl}/links/${ids[0]}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else {
        res = await fetch(`${apiUrl}/links`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete URLs');
      }

      setSelectionModel({
        type: 'include',
        ids: new Set(),
      });

      await fetchRows();
    } catch (error) {
      console.error('Error deleting URLs:', error);
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
            disableRowSelectionOnClick
            disableRowSelectionExcludeModel
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={setSelectionModel}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(error) => {
              console.error('Error updating redirect:', error);
            }}
          />
        </ThemeProvider>
        <div className='btn-container'>
          <Button
            text={`Delete selected (${selectionModel.ids.size})`}
            disabled={selectionModel.ids.size === 0}
            onClick={handleDelete}
          />
        </div>
      </Box>
    </section>
  );
}
