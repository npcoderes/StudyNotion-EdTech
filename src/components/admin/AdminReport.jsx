import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  DataGrid,
  GridToolbar,
} from '@mui/x-data-grid';
import {
  DownloadOutlined,
  PictureAsPdf,
  TableChart,
  Assessment,
  People,
  School,
  DateRange,
  PersonAdd,
  Group,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const AdminReport = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [accountType, setAccountType] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    instructors: 0,
    newUsersThisMonth: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(BASE_URL + '/admin/report');
      setUsers(response.data);
      setFilteredUsers(response.data);
      calculateStats(response.data);
      console.log('Users:', response.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userData) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    setStats({
      totalUsers: userData.length,
      students: userData.filter(user => user.accountType === 'Student').length,
      instructors: userData.filter(user => user.accountType === 'Instructor').length,
      newUsersThisMonth: userData.filter(user => new Date(user.createdAt) >= thisMonth).length
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    let filtered = [...users];

    if (startDate && endDate) {
      filtered = filtered.filter(user => {
        const createdAt = new Date(user.createdAt);
        return createdAt >= new Date(startDate) && createdAt <= new Date(endDate);
      });
    }

    if (accountType) {
      filtered = filtered.filter(user => user.accountType === accountType);
    }

    setFilteredUsers(filtered);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('User Report', 20, 10);
    doc.autoTable({
      head: [['Name', 'Email', 'Account Type', 'Join Date']],
      body: filteredUsers.map(user => [
        `${user.firstName} ${user.lastName}`,
        user.email,
        user.accountType,
        new Date(user.createdAt).toLocaleDateString()
      ])
    });
    doc.save('user_report.pdf');
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers.map(user => ({
      'First Name': user.firstName,
      'Last Name': user.lastName,
      'Email': user.email,
      'Account Type': user.accountType,
      'Join Date': new Date(user.createdAt).toLocaleDateString()
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer]), 'user_report.xlsx');
  };

  const columns = [
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    {
      field: 'accountType',
      headerName: 'Account Type',
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Instructor' ? 'primary' : 'secondary'}
          size="small"
        />
      )
    },
    {
      field: 'createdAt',
      headerName: 'Join Date',
      flex: 1,
      // date in this formate 2024-10-28T13:05:30.609Z
      renderCell: (params) => (
        <Tooltip title={new Date(params.value).toLocaleString()}>
          <IconButton size="small">
            <DateRange />
          </IconButton>
        </Tooltip>
      )
      // valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    }
  ];
  const processChartData = (users) => {
    const dateGroups = {};

    users.forEach(user => {
      const date = new Date(user.createdAt).toLocaleDateString();
      if (!dateGroups[date]) {
        dateGroups[date] = {
          date,
          Student: 0,
          Instructor: 0
        };
      }
      dateGroups[date][user.accountType]++;
    });

    return Object.values(dateGroups);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <People color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h6">Total Users</Typography>
                </Box>
                <Typography variant="h4">{stats.totalUsers}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <School color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h6">Students</Typography>
                </Box>
                <Typography variant="h4">{stats.students}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <Group color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h6">Instructors</Typography>
                </Box>
                <Typography variant="h4">{stats.instructors}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <PersonAdd color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h6">New This Month</Typography>
                </Box>
                <Typography variant="h4">{stats.newUsersThisMonth}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <form onSubmit={handleFilterSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Account Type"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Student">Student</MenuItem>
                  <MenuItem value="Instructor">Instructor</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Assessment />}
                  type="submit"
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Export Buttons */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdf />}
            onClick={downloadPDF}
            sx={{ mr: 2 }}
          >
            Export PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<TableChart />}
            onClick={downloadExcel}
          >
            Export Excel
          </Button>
        </Box>

        {/* Data Grid */}
        <Paper sx={{ height: 400, width: '100%', mb: 4 }}>
          {loading ? (
            <LinearProgress />
          ) : (
            <DataGrid
              rows={filteredUsers}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
              disableSelectionOnClick
              components={{
                Toolbar: GridToolbar,
              }}
              getRowId={(row) => row._id}
            />
          )}
        </Paper>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                User Registration Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={processChartData(filteredUsers)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="Student" fill="#2196f3" name="Students" />
                  <Bar dataKey="Instructor" fill="#f50057" name="Instructors" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminReport;