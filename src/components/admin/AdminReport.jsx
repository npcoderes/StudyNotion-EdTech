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
import { PieChart, Pie, Cell, LabelList } from 'recharts';

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
      // Create date objects with time set to start and end of day
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);  // Set to beginning of the day
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);  // Set to end of the day
      
      filtered = filtered.filter(user => {
        const createdAt = new Date(user.createdAt);
        return createdAt >= start && createdAt <= end;
      });
    }

    if (accountType) {
      filtered = filtered.filter(user => user.accountType === accountType);
    }

    setFilteredUsers(filtered);
  };
  const processUserDistributionData = (users) => {
    return [
      { name: 'Students', value: users.filter(u => u.accountType === 'Student').length },
      { name: 'Instructors', value: users.filter(u => u.accountType === 'Instructor').length }
    ];
  };

  // Enhanced PDF generation
  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Brand Colors
    const colors = {
      primary: [255, 214, 10],     // yellow-50
      secondary: [33, 33, 33],     // richblack-900
      accent: [255, 255, 255],     // white
      table: {
        header: [33, 33, 33],
        odd: [242, 242, 242],
        even: [255, 255, 255]
      }
    };

    // Calculate stats first 
    const userStats = {
      totalUsers: filteredUsers.length,
      students: filteredUsers.filter(u => u.accountType === 'Student').length,
      instructors: filteredUsers.filter(u => u.accountType === 'Instructor').length,
      newUsersThisMonth: filteredUsers.filter(u => {
        const userDate = new Date(u.createdAt);
        const today = new Date();
        return userDate.getMonth() === today.getMonth() &&
          userDate.getFullYear() === today.getFullYear();
      }).length
    };

    const statsData = [
      ['Total Users', 'Students', 'Instructors', 'New Users this Month'],
      [
        userStats.totalUsers.toString(),
        userStats.students.toString(),
        userStats.instructors.toString(),
        userStats.newUsersThisMonth.toString()
      ]
    ];

    // Header Section
    doc.setFillColor(...colors.secondary);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');

    // Main Title
    doc.setFontSize(28);
    doc.setTextColor(...colors.primary);
    doc.text('StudyNotion', 20, 20);

    // Report Title
    doc.setFontSize(18);
    doc.setTextColor(...colors.accent);
    doc.text('User Analysis Report', 20, 32);

    // Date on right
    const dateText = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.setFontSize(12);
    const dateWidth = doc.getTextWidth(dateText);
    doc.text(dateText, doc.internal.pageSize.width - dateWidth - 20, 20);

    // Stats Grid
    const statsY = 50;
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(15, statsY, doc.internal.pageSize.width - 30, 35, 3, 3, 'F');

    const colWidth = (doc.internal.pageSize.width - 60) / 4;
    statsData[0].forEach((label, i) => {
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0);
      doc.text(label, 25 + (i * colWidth), statsY + 15);
      doc.setFont(undefined, 'normal');
      doc.text(statsData[1][i], 25 + (i * colWidth), statsY + 25);
    });
    // Add Table
    doc.autoTable({
      startY: statsY + 45,
      head: [['Name', 'Email', 'Account Type', 'Join Date', 'Status']],
      body: filteredUsers.map(user => [
        `${user.firstName} ${user.lastName}`,
        user.email,
        user.accountType,
        new Date(user.createdAt).toLocaleDateString(),
        user.active ? 'Active' : 'Inactive'
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 5,
        lineColor: [200, 200, 200],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: colors.table.header,
        textColor: colors.accent,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: colors.table.odd
      },
      bodyStyles: {
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'left' }
      },
      margin: { top: 10 }
    });

    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    // Rest of your PDF generation code...
    doc.save('user_analysis_report.pdf');
  };
  const downloadExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      ['StudyNotion User Report'],
      ['Generated on:', new Date().toLocaleString()],
      [''],
      ['Summary Statistics'],
      ['Total Users:', stats.totalUsers],
      ['Students:', stats.students],
      ['Instructors:', stats.instructors],
      ['New Users This Month:', stats.newUsersThisMonth]
    ];

    const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);

    // Users Sheet
    const usersData = filteredUsers.map(user => ({
      'First Name': user.firstName,
      'Last Name': user.lastName,
      'Email': user.email,
      'Account Type': user.accountType,
      'Join Date': new Date(user.createdAt).toLocaleDateString(),
      'Status': 'Active'
    }));

    const usersWS = XLSX.utils.json_to_sheet(usersData);

    // Add sheets to workbook
    XLSX.utils.book_append_sheet(workbook, summaryWS, 'Summary');
    XLSX.utils.book_append_sheet(workbook, usersWS, 'User Details');

    // Generate Excel file
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
            
           variant='contained'
            color='primary'
            startIcon={<PictureAsPdf />}
            onClick={downloadPDF}
            sx={{ mr: 2 }}
          >
            Export PDF
          </Button>
          <Button
            variant="contained"
            color="success"
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

        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                User Registration Trend
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={processChartData(filteredUsers)}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none' }}
                    cursor={{ fill: 'rgba(0,0,0,0.1)' }}
                  />
                  <Legend />
                  <Bar dataKey="Student" fill="#2196f3" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="Student" position="top" />
                  </Bar>
                  <Bar dataKey="Instructor" fill="#f50057" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="Instructor" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                User Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={processUserDistributionData(filteredUsers)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {processUserDistributionData(filteredUsers).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#2196f3' : '#f50057'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminReport;