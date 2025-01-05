import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Box,
  Stack
} from '@mui/material';
import {
  PictureAsPdf,
  FileDownload,
  CalendarToday,
  Person,
  Category,
  AttachMoney,
  People
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Bar, Pie } from 'react-chartjs-2';
import { CircularProgress } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const { REACT_APP_BASE_URL } = process.env;

const AdminCourseReport = () => {
  const [courses, setCourses] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [instructor, setInstructor] = useState('');
  const [instructors, setInstructors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const BASE_URL = REACT_APP_BASE_URL;
  const [popularityFilter, setPopularityFilter] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
    fetchCategories();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/admin/courses`, {
        params: {
          startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : '',
          endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : '',
          status,
          category,
          instructor
        }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
    setLoading(false);
  };

  const fetchInstructors = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/instructors`);
      setInstructors(response.data);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
    let filtered = [...courses];

    // Apply existing filters
    if (startDate && endDate) {
      filtered = filtered.filter(course => {
        const createdAt = new Date(course.createdAt);
        return createdAt >= new Date(startDate) && createdAt <= new Date(endDate);
      });
    }

    if (status) {
      filtered = filtered.filter(course => course.status === status);
    }

    if (category) {
      filtered = filtered.filter(course => course.category._id === category);
    }

    // Apply popularity filter
    if (popularityFilter) {
      filtered = sortByPopularity(filtered, popularityFilter);
    }

    setFilteredCourses(filtered);
  };
  const sortByPopularity = (courses, filterType) => {
    switch (filterType) {
      case 'mostEnrolled':
        return [...courses].sort((a, b) => b.studentsEnrolledCount - a.studentsEnrolledCount);
      case 'highestRevenue':
        return [...courses].sort((a, b) => (b.price * b.studentsEnrolledCount) - (a.price * a.studentsEnrolledCount));
      case 'recent':
        return [...courses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return courses;
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'Published':
        return 'success';
      case 'Draft':
        return 'warning';
      default:
        return 'default';
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a3',
    });
  
    // Enhanced Header
    const addHeader = () => {
      doc.setFillColor(41, 128, 185);
      doc.rect(0, 0, doc.internal.pageSize.width, 25, 'F');
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text('StudyNotion Course Report', 15, 15);
      doc.setFontSize(14);
      doc.text('Generated Report', 15, 22);
    };
  
    // Filter Summary Section
    const addFilterSummary = (y) => {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Report Filters:', 15, y);
      y += 8;
      if (startDate) doc.text(`Date Range: ${dayjs(startDate).format('DD/MM/YYYY')} - ${dayjs(endDate).format('DD/MM/YYYY')}`, 20, y);
      y += 7;
      if (status) doc.text(`Status: ${status}`, 20, y);
      y += 7;
      if (category) {
        const categoryName = categories.find(c => c._id === category)?.name;
        doc.text(`Category: ${categoryName}`, 20, y);
      }
      y += 7;
      if (popularityFilter) doc.text(`Sorted by: ${popularityFilter}`, 20, y);
      return y + 15;
    };
  
    // Statistics Summary
    const addStatistics = (y) => {
      const totalRevenue = filteredCourses.reduce((sum, course) => 
        sum + (course.price * course.studentsEnrolledCount), 0);
      const totalStudents = filteredCourses.reduce((sum, course) => 
        sum + course.studentsEnrolledCount, 0);
  
      doc.setFillColor(230, 230, 230);
      doc.rect(15, y, doc.internal.pageSize.width - 30, 30, 'F');
      doc.setFontSize(12);
      doc.text([
        `Total Courses: ${filteredCourses.length}`,
        `Total Students: ${totalStudents}`,
        `Total Revenue: ₹${totalRevenue.toLocaleString()}`,
        `Active Courses: ${filteredCourses.filter(c => c.status === 'Published').length}`
      ], 20, y + 8);
  
      return y + 40;
    };
  
    // Course Table
    const addCourseTable = (y) => {
      doc.autoTable({
        startY: y,
        head: [['Course Name', 'Instructor', 'Category', 'Price', 'Status', 'Students', 'Revenue']],
        body: filteredCourses.map(course => [
          course.courseName,
          `${course.instructor.firstName} ${course.instructor.lastName}`,
          course.category.name,
          `₹${course.price}`,
          course.status,
          course.studentsEnrolledCount,
          `₹${(course.price * course.studentsEnrolledCount).toLocaleString()}`
        ]),
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        footStyles: { fillColor: [220, 220, 220] },
      });
    };
  
    // Generate PDF
    addHeader();
    let yPos = 35;
    yPos = addFilterSummary(yPos);
    yPos = addStatistics(yPos);
    addCourseTable(yPos);
  
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, doc.internal.pageSize.height - 10);
    doc.save('course_report.pdf');
  };
  
  
  const downloadExcel = () => {
    const workbook = XLSX.utils.book_new();
  
    // Summary Sheet
    const summaryData = [
      ['StudyNotion Course Report'],
      ['Generated on:', new Date().toLocaleString()],
      [''],
      ['Report Filters'],
      ['Date Range:', startDate ? `${dayjs(startDate).format('DD/MM/YYYY')} - ${dayjs(endDate).format('DD/MM/YYYY')}` : 'All'],
      ['Status:', status || 'All'],
      ['Category:', category ? categories.find(c => c._id === category)?.name : 'All'],
      ['Sort By:', popularityFilter || 'None'],
      [''],
      ['Summary Statistics'],
      ['Total Courses:', filteredCourses.length],
      ['Active Courses:', filteredCourses.filter(c => c.status === 'Published').length],
      ['Total Students:', filteredCourses.reduce((sum, c) => sum + c.studentsEnrolledCount, 0)],
      ['Total Revenue:', `₹${filteredCourses.reduce((sum, c) => sum + (c.price * c.studentsEnrolledCount), 0).toLocaleString()}`],
    ];
  
    // Course Details Sheet
    const courseData = [
      ['Course Name', 'Instructor', 'Category', 'Price', 'Status', 'Students', 'Revenue', 'Created Date']
    ];
    filteredCourses.forEach(course => {
      courseData.push([
        course.courseName,
        `${course.instructor.firstName} ${course.instructor.lastName}`,
        course.category.name,
        `₹${course.price}`,
        course.status,
        course.studentsEnrolledCount,
        `₹${(course.price * course.studentsEnrolledCount).toLocaleString()}`,
        new Date(course.createdAt).toLocaleDateString()
      ]);
    });
  
    const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
    const courseWS = XLSX.utils.aoa_to_sheet(courseData);
  
    XLSX.utils.book_append_sheet(workbook, summaryWS, 'Summary');
    XLSX.utils.book_append_sheet(workbook, courseWS, 'Course Details');
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'course_report.xlsx');
  };
  
  // 1. Update chart data preparation
  const getCategoryChartData = () => {
    return {
      labels: categories.map(cat => cat.name),
      datasets: [{
        data: categories.map(cat =>
          courses.filter(course =>
            course.category._id === cat._id
          ).length
        ),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ]
      }]
    };
  };

  const getRevenueChartData = () => {
    return {
      labels: instructors.map(inst => `${inst.firstName} ${inst.lastName}`),
      datasets: [{
        label: 'Revenue',
        data: instructors.map(inst =>
          courses
            .filter(course => course.instructor._id === inst._id)
            .reduce((sum, course) => sum + ((course.price * 80 / 100) * course.studentsEnrolledCount), 0)
        ),
        backgroundColor: '#36A2EB'
      }]
    };
  };

  const getRevenueAdminChartData = () => {
    return {
      labels: ['Admin Revenue'],
      datasets: [{
        label: 'Revenue',
        data: instructors.map(inst =>
          courses
            .filter(course => course.instructor._id === inst._id)
            .reduce((sum, course) => sum + ((course.price * 20 / 100) * course.studentsEnrolledCount), 0)
        ),
        backgroundColor: '#36A2EB'
      }]
    };
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Course Report
          </Typography>

          <form onSubmit={handleFilterSubmit}>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Published">Published</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Instructor"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {instructors.map((inst) => (
                    <MenuItem key={inst._id} value={inst._id}>
                      {`${inst.firstName} ${inst.lastName}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Sort By Popularity"
                  value={popularityFilter}
                  onChange={(e) => {
                    setPopularityFilter(e.target.value);
                    const sortedCourses = sortByPopularity(courses, e.target.value);
                    setFilteredCourses(sortedCourses);
                  }}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="mostEnrolled">Most Enrolled</MenuItem>
                  <MenuItem value="highestRevenue">Highest Revenue</MenuItem>
                  <MenuItem value="recent">Recently Added</MenuItem>
                </TextField>
              </Grid>
              <Grid container spacing={3} sx={{ mt: 4 }}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Courses by Category
                    </Typography>
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Pie
                        data={getCategoryChartData()}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }}
                      />
                    )}
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Revenue by Instructor
                    </Typography>
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Bar
                        data={getRevenueChartData()}
                        options={{
                          responsive: true,
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: 'Revenue (₹)'
                              }
                            }
                          }
                        }}
                      />
                    )}
                  </Paper>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Revenue Of Admin
                    </Typography>
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Bar
                        data={getRevenueAdminChartData()}
                        options={{
                          responsive: true,
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: 'Revenue (₹)'
                              }
                            }
                          }
                        }}
                      />
                    )}
                  </Paper>
                </Grid>

              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{ height: '56px' }}
                >
                  Generate Report
                </Button>
              </Grid>
            </Grid>
          </form>

          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<PictureAsPdf />}
              onClick={downloadPDF}
            >
              Download PDF
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<FileDownload />}
              onClick={downloadExcel}
            >
              Download Excel
            </Button>
          </Stack>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course Name</TableCell>
                  <TableCell>Instructor</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Students Enrolled</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course._id} hover>
                    <TableCell>{course.courseName}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 30, height: 30 }}>
                          {course.instructor.firstName[0]}
                        </Avatar>
                        {`${course.instructor.firstName} ${course.instructor.lastName}`}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<Category />}
                        label={course.category.name}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>

                        ₹{course.price}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={course.status}
                        color={getStatusColor(course.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarToday fontSize="small" />
                        {new Date(course.createdAt).toLocaleDateString()}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <People fontSize="small" />
                        {course.studentsEnrolledCount}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default AdminCourseReport;