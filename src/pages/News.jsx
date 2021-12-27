import { useEffect, useCallback, useState, useMemo } from 'react';
import { Tooltip, Typography, Avatar, Paper } from '@mui/material';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
    gridClasses,
} from '@mui/x-data-grid';

import { useNews } from '../store/news';

const columns = [
    {
        field: 'author',
        headerName: 'Author',
    },
    {
        field: 'content',
        headerName: 'Content',
    },
    {
        field: 'description',
        headerName: 'Description',
    },
    {
        field: 'publishedAt',
        headerName: 'Published At',
    },
    {
        field: 'title',
        headerName: 'Title',
    },
    {
        field: 'url',
        headerName: 'Url',
    },
    {
        field: 'urlToImage',
        headerName: 'Image',
    },
];

const NewsPage = () => {
	const [news, newsActions] = useNews();

	const [readActionParams, setReadActionParams] = useState({
        pageSize: 10,
        pageNumber: 1,
    });
    const handleChangePageSize = useCallback(pageSize => {
        setReadActionParams((params) => ({ ...params, pageSize }));
    }, []);

    const handleChangePageNumber = useCallback(pageNumber => {
        setReadActionParams((params) => ({
            ...params,
            pageNumber: pageNumber + 1,
        }));
    }, []);
    const customToolbar = () => {
        return(
            <GridToolbarContainer className={gridClasses.toolbarContainer}>
                <GridToolbarExport />
            </GridToolbarContainer>
        )
    }
    const gridCols= useMemo(
        () =>
            columns.map(
                (element) => ({
                    field: element.field,
                    headerName: element.headerName,
                    width: 250,
                    renderCell: (params) => (
                        params.field === 'urlToImage'
                        ? (
                            <Avatar
                                alt="Remy Sharp"
                                src={params.value}
                                sx={{ width: 56, height: 56 }}
                            />)
                        : (
                            <Tooltip title={params.value || ''}>
                                <Typography noWrap>{params.value}</Typography>
                            </Tooltip>
                        )
                    ),
                })
            ),
        [columns]
    );

    useEffect(() => {
        newsActions.read(readActionParams);
    }, [newsActions, readActionParams]);

	return (
                <Paper elevation={3} sx={{
                    height: '100vh',
                }}>
                    <DataGrid
                        getRowId={(row) => row.url}
                        columns={gridCols}
                        pageSize={readActionParams.pageSize}
                        onPageChange={handleChangePageNumber}
                        rows={news.data}
                        rowCount={news.totalResults}
                        onPageSizeChange={handleChangePageSize}
                        rowsPerPageOptions={[10, 20, 50]}
                        loading={news.status === 'loading'}
                        paginationMode='server'
                        components={{
                            Toolbar: customToolbar,
                        }}
                    />
            </Paper>
    )
}

export default NewsPage;