import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaIndianRupeeSign } from "react-icons/fa6";
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
  Stack,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  PictureAsPdf,
  FileDownload,
  CalendarToday,
  Category,
  People,
  FilterAlt,
  ClearAll
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Bar, Pie } from 'react-chartjs-2';
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
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [instructor, setInstructor] = useState('');
  const [instructors, setInstructors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const BASE_URL = REACT_APP_BASE_URL;
  const [popularityFilter, setPopularityFilter] = useState('');

  // Create refs for the charts
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const adminChartRef = useRef(null);

  useEffect(() => {
    // Fetch initial data
    Promise.all([
      fetchCoursesData(),
      fetchInstructors(),
      fetchCategories()
    ]).then(() => {
      setFetchingData(false);
    }).catch(error => {
      console.error("Error fetching initial data:", error);
      setError("Failed to load initial data. Please refresh the page.");
      setFetchingData(false);
    });
  }, []);

  // Function to fetch courses data
  const fetchCoursesData = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        startDate: filters.startDate ? dayjs(filters.startDate).format('YYYY-MM-DD') : '',
        endDate: filters.endDate ? dayjs(filters.endDate).format('YYYY-MM-DD') : '',
        status: filters.status || '',
        category: filters.category || '',
        instructor: filters.instructor || '',
      };

      const response = await axios.get(`${BASE_URL}/admin/courses`, { params });
      const coursesData = response.data;
      
      // For debugging purposes
      console.log("API response:", coursesData);
      
      setCourses(coursesData);
      
      // Apply client-side sorting if needed
      let processedCourses = [...coursesData];
      if (filters.popularityFilter) {
        processedCourses = sortByPopularity(processedCourses, filters.popularityFilter);
      }
      
      setFilteredCourses(processedCourses);
      return coursesData;
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError(`Failed to fetch courses: ${error.response?.data?.message || error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/instructors`);
      setInstructors(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching instructors:', error);
      setError(`Failed to fetch instructors: ${error.response?.data?.message || error.message}`);
      return [];
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/categories`);
      setCategories(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(`Failed to fetch categories: ${error.response?.data?.message || error.message}`);
      return [];
    }
  };

  // Show snackbar notification
  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // Close snackbar handler
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle filter form submission
  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dates if both are provided
    if (startDate && endDate && dayjs(startDate).isAfter(endDate)) {
      showNotification('Start date must be before end date', 'error');
      return;
    }

    try {
      // Apply filters through API
      await fetchCoursesData({
        startDate,
        endDate,
        status,
        category,
        instructor,
        popularityFilter
      });
      
      // Show success message with filter details
      let filterMessage = 'Filters applied';
      if (startDate && endDate) filterMessage += `: Date range ${dayjs(startDate).format('DD/MM/YYYY')} - ${dayjs(endDate).format('DD/MM/YYYY')}`;
      if (status) filterMessage += filterMessage.includes(':') ? `, Status: ${status}` : `: Status: ${status}`;
      if (category) {
        const categoryName = categories.find(c => c._id === category)?.name || category;
        filterMessage += filterMessage.includes(':') ? `, Category: ${categoryName}` : `: Category: ${categoryName}`;
      }
      if (instructor) {
        const instructorName = instructors.find(i => i._id === instructor)?.firstName || instructor;
        filterMessage += filterMessage.includes(':') ? `, Instructor: ${instructorName}` : `: Instructor: ${instructorName}`;
      }
      
      showNotification(filterMessage, 'success');
      
    } catch (err) {
      showNotification('Error applying filters', 'error');
    }
  };

  // Function to reset all filters
  const handleResetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setStatus('');
    setCategory('');
    setInstructor('');
    setPopularityFilter('');
    
    // Reset to original data
    setFilteredCourses(courses);
    showNotification('All filters have been reset', 'info');
  };

  // Sort courses by different criteria
  const sortByPopularity = (coursesArr, filterType) => {
    let sorted = [...coursesArr];
    
    switch (filterType) {
      case 'mostEnrolled':
        sorted = sorted.sort((a, b) => b.studentsEnrolledCount - a.studentsEnrolledCount);
        break;
      case 'highestRevenue':
        sorted = sorted.sort((a, b) => 
          (b.price * b.studentsEnrolledCount) - (a.price * a.studentsEnrolledCount)
        );
        break;
      case 'recent':
        sorted = sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // No sorting
        break;
    }
    
    return sorted;
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    setPopularityFilter(sortValue);
    
    if (sortValue) {
      const sorted = sortByPopularity(filteredCourses, sortValue);
      setFilteredCourses(sorted);
      showNotification(`Courses sorted by ${sortValue}`, 'info');
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
  
    // Define brand colors
    const colors = {
      primary: [255, 214, 10],
      secondary: [78, 78, 78],
      accent: [255, 255, 255],
      table: {
        header: [78, 78, 78],
        odd: [242, 242, 242],
        even: [255, 255, 255],
      },
    };
  
    // Add Header
    const addHeader = () => {
      doc.setFillColor(...colors.secondary);
      doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F'); // Header background
      doc.setFontSize(28);
      doc.setTextColor(...colors.primary);
      doc.text('StudyNotion', 15, 20);
      doc.setFontSize(12);
      doc.setTextColor(...colors.accent);
      doc.text('Course Analysis Report', 15, 28);
  
      // Add generated date
      const dateText = `Generated on: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`;
      doc.setFontSize(10);
      const dateWidth = doc.getTextWidth(dateText);
      doc.text(dateText, doc.internal.pageSize.width - dateWidth - 15, 20);
    };
  
    // Add Filter Summary
    const addFilterSummary = (y) => {
      doc.setFillColor(...colors.primary);
      doc.rect(10, y, doc.internal.pageSize.width - 20, 10, 'F'); // Filter summary background
      doc.setFontSize(12);
      doc.setTextColor(...colors.secondary);
      doc.setFont('helvetica', 'bold');
      doc.text('Report Parameters', 15, y + 8);
  
      y += 15; // Move cursor down
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
  
      const filters = [];
      if (startDate) filters.push(`• Date Range: ${dayjs(startDate).format('DD/MM/YYYY')} - ${endDate ? dayjs(endDate).format('DD/MM/YYYY') : 'Present'}`);
      if (status) filters.push(`• Status: ${status}`);
      if (category) {
        const categoryName = categories.find((c) => c._id === category)?.name || 'Unknown';
        filters.push(`• Category: ${categoryName}`);
      }
      if (instructor) {
        const instructorName = instructors.find((i) => i._id === instructor)?.firstName || 'Unknown';
        filters.push(`• Instructor: ${instructorName}`);
      }
      if (popularityFilter) filters.push(`• Sorted by: ${popularityFilter}`);
      
      if (filters.length === 0) filters.push('• No filters applied (showing all courses)');
  
      doc.text(filters, 20, y);
      return y + filters.length * 6 + 15; // Adjust spacing dynamically
    };
  
    // Add Statistics
    const addStatistics = (y) => {
      const totalRevenue = filteredCourses.reduce((sum, course) => sum + course.price * course.studentsEnrolledCount, 0);
      const totalStudents = filteredCourses.reduce((sum, course) => sum + course.studentsEnrolledCount, 0);
      const activeCount = filteredCourses.filter((c) => c.status === 'Published').length;
  
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(15, y, doc.internal.pageSize.width - 30, 30, 3, 3, 'F'); // Statistics background
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
  
      const stats = [
        ['Total Courses', 'Active Courses', 'Total Students', 'Total Revenue'],
        [
          filteredCourses.length.toString(),
          activeCount.toString(),
          totalStudents.toString(),
          `Rs. ${totalRevenue.toLocaleString()}`,
        ],
      ];
  
      const colWidth = (doc.internal.pageSize.width - 60) / 4;
      stats[0].forEach((label, i) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 25 + i * colWidth, y + 12); // Column headers
        doc.setFont('helvetica', 'normal');
        doc.text(stats[1][i], 25 + i * colWidth, y + 22); // Column values
      });
  
      return y + 40; // Adjust spacing
    };
  
    // Add Course Table
    const addCourseTable = (y) => {
      doc.autoTable({
        startY: y,
        head: [['Course Name', 'Instructor', 'Category', 'Price', 'Status', 'Students', 'Revenue']],
        body: filteredCourses.map((course) => [
          course.courseName,
          `${course.instructor.firstName} ${course.instructor.lastName}`,
          course.category?.name || 'N/A',
          `Rs. ${course.price}`,
          course.status,
          course.studentsEnrolledCount,
          `Rs. ${(course.price * course.studentsEnrolledCount).toLocaleString()}`,
        ]),
        styles: {
          fontSize: 10,
          cellPadding: 4,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: colors.table.header,
          textColor: colors.accent,
          fontStyle: 'bold',
          halign: 'center',
        },
        alternateRowStyles: {
          fillColor: colors.table.odd,
        },
        bodyStyles: {
          halign: 'center',
        },
        columnStyles: {
          0: { halign: 'left' },
          1: { halign: 'left' },
          2: { halign: 'left' },
        },
        margin: { top: 10 },
        didDrawPage: function (data) {
          if (data.pageNumber > 1) {
            addHeader(); // Add header on every page
          }
        },
      });
    };
  
    // Add Charts
    const addCharts = () => {
      doc.addPage(); // Add a new page for charts
      addHeader(); // Add header on chart page
      
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      const title = 'Graphical Representations';
      const titleWidth = doc.getTextWidth(title);
      doc.text(title, (doc.internal.pageSize.width - titleWidth) / 2, 50);
  
      // Try to add pie chart if available
      if (pieChartRef.current) {
        try {
          const pieImg = pieChartRef.current.toBase64Image('image/png', 2.0); // Higher quality
          doc.setFontSize(20); // Increased font size
          const pieTitle = 'Courses by Category';
          doc.text(pieTitle, 25, 70); // Moved to left with margin
          doc.addImage(pieImg, 'PNG', 15, 80, 180, 100); // Larger chart size
        } catch (err) {
          console.error('Error adding pie chart to PDF:', err);
        }
      }
    
      // Add "Revenue by Instructor" Bar Chart
      if (barChartRef.current) {
        try {
          const barImg = barChartRef.current.toBase64Image('image/png', 2.0);
          doc.setFontSize(20);
          const barTitle = 'Revenue by Instructor';
          doc.text(barTitle, doc.internal.pageSize.width / 2 + 20, 70); // Adjusted position
          doc.addImage(barImg, 'PNG', doc.internal.pageSize.width / 2 + 10, 80, 180, 100);
        } catch (err) {
          console.error('Error adding bar chart to PDF:', err);
        }
      }
    
      // Add "Revenue Of Admin" Bar Chart
      if (adminChartRef.current) {
        try {
          const adminImg = adminChartRef.current.toBase64Image('image/png', 2.0);
          doc.setFontSize(20);
          const adminTitle = 'Revenue Of Admin';
          doc.text(adminTitle, 25, 200); // Aligned with first chart title
          doc.addImage(adminImg, 'PNG', 15, 210, 180, 100);
        } catch (err) {
          console.error('Error adding admin chart to PDF:', err);
        }
      }
    };
  
    try {
      // Generate PDF Content
      addHeader();
      let yPos = 40; // Initial Y position
      yPos = addFilterSummary(yPos);
      yPos = addStatistics(yPos);
      addCourseTable(yPos);
      
      // Only add charts if we have data
      if (filteredCourses.length > 0) {
        addCharts();
      }
    
      // Add Footer with Page Numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
    
      // Save PDF
      doc.save('course_report.pdf');
      showNotification('PDF report generated successfully', 'success');
    } catch (err) {
      console.error('Error generating PDF:', err);
      showNotification('Failed to generate PDF report', 'error');
    }
  };

  const downloadExcel = () => {
    try {
      const workbook = XLSX.utils.book_new();
  
      // Filter details for summary
      const categoryName = category ? categories.find(c => c._id === category)?.name || 'Unknown' : 'All';
      const instructorName = instructor ? 
        instructors.find(i => i._id === instructor)?.firstName + ' ' + 
        instructors.find(i => i._id === instructor)?.lastName || 'Unknown' : 'All';
  
      // Summary Sheet with enhanced information
      const summaryData = [
        ['StudyNotion Course Report'],
        ['Generated on:', new Date().toLocaleString()],
        [''],
        ['Report Filters'],
        ['Date Range:', startDate ? 
          `${dayjs(startDate).format('DD/MM/YYYY')} - ${endDate ? dayjs(endDate).format('DD/MM/YYYY') : 'Present'}` : 
          'All Time'],
        ['Status:', status || 'All'],
        ['Category:', categoryName],
        ['Instructor:', instructorName],
        ['Sort By:', popularityFilter || 'None'],
        [''],
        ['Summary Statistics'],
        ['Total Courses:', filteredCourses.length],
        ['Active Courses:', filteredCourses.filter(c => c.status === 'Published').length],
        ['Total Students:', filteredCourses.reduce((sum, c) => sum + c.studentsEnrolledCount, 0)],
        ['Total Revenue:', `₹${filteredCourses.reduce((sum, c) => sum + (c.price * c.studentsEnrolledCount), 0).toLocaleString()}`],
      ];
  
      // Course details for main sheet
      const courseData = [
        ['Course Name', 'Instructor', 'Category', 'Price (₹)', 'Status', 'Students', 'Revenue (₹)', 'Created Date']
      ];
      
      filteredCourses.forEach(course => {
        courseData.push([
          course.courseName,
          `${course.instructor.firstName} ${course.instructor.lastName}`,
          course.category?.name || 'N/A',
          course.price,
          course.status,
          course.studentsEnrolledCount,
          course.price * course.studentsEnrolledCount,
          new Date(course.createdAt).toLocaleDateString()
        ]);
      });
  
      // Revenue sheet for more detailed analysis
      const revenueData = [
        ['Instructor', 'Courses Count', 'Total Students', 'Instructor Revenue (80%)', 'Admin Revenue (20%)', 'Total Revenue']
      ];
  
      // Group by instructor to summarize revenue
      const instructorRevenue = {};
      filteredCourses.forEach(course => {
        const instructorId = course.instructor._id;
        const instructorName = `${course.instructor.firstName} ${course.instructor.lastName}`;
        const courseRevenue = course.price * course.studentsEnrolledCount;
        
        if (!instructorRevenue[instructorId]) {
          instructorRevenue[instructorId] = {
            name: instructorName,
            coursesCount: 0,
            students: 0,
            instructorRevenue: 0,
            adminRevenue: 0,
            totalRevenue: 0
          };
        }
        
        instructorRevenue[instructorId].coursesCount++;
        instructorRevenue[instructorId].students += course.studentsEnrolledCount;
        instructorRevenue[instructorId].instructorRevenue += courseRevenue * 0.8;
        instructorRevenue[instructorId].adminRevenue += courseRevenue * 0.2;
        instructorRevenue[instructorId].totalRevenue += courseRevenue;
      });
  
      // Add instructor revenue data
      Object.values(instructorRevenue).forEach(data => {
        revenueData.push([
          data.name,
          data.coursesCount,
          data.students,
          Math.round(data.instructorRevenue),
          Math.round(data.adminRevenue),
          Math.round(data.totalRevenue)
        ]);
      });
  
      // Calculate totals
      const totalRevenue = Object.values(instructorRevenue).reduce((sum, data) => sum + data.totalRevenue, 0);
      const totalInstructorRevenue = Object.values(instructorRevenue).reduce((sum, data) => sum + data.instructorRevenue, 0);
      const totalAdminRevenue = Object.values(instructorRevenue).reduce((sum, data) => sum + data.adminRevenue, 0);
      
      // Add totals row
      revenueData.push([
        'TOTAL',
        filteredCourses.length,
        filteredCourses.reduce((sum, c) => sum + c.studentsEnrolledCount, 0),
        Math.round(totalInstructorRevenue),
        Math.round(totalAdminRevenue),
        Math.round(totalRevenue)
      ]);
  
      // Create sheets
      const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
      const courseWS = XLSX.utils.aoa_to_sheet(courseData);
      const revenueWS = XLSX.utils.aoa_to_sheet(revenueData);
  
      // Add sheets to workbook
      XLSX.utils.book_append_sheet(workbook, summaryWS, 'Summary');
      XLSX.utils.book_append_sheet(workbook, courseWS, 'Course Details');
      XLSX.utils.book_append_sheet(workbook, revenueWS, 'Revenue Analysis');
  
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(data, 'course_report.xlsx');
      
      showNotification('Excel report generated successfully', 'success');
    } catch (err) {
      console.error('Error generating Excel report:', err);
      showNotification('Failed to generate Excel report', 'error');
    }
  };

  // Chart data functions
  const getCategoryChartData = () => {
    // Map categories to their counts in the filtered courses
    const categoryCounts = {};
    categories.forEach(cat => {
      categoryCounts[cat.name] = 0;
    });
    
    // Count courses per category
    filteredCourses.forEach(course => {
      if (course.category && course.category.name) {
        if (categoryCounts[course.category.name] !== undefined) {
          categoryCounts[course.category.name]++;
        } else {
          // Handle case where category exists in course but not in categories array
          categoryCounts[course.category.name] = 1;
        }
      }
    });
    
    // Filter out categories with zero courses for better visualization
    const labels = Object.keys(categoryCounts).filter(name => categoryCounts[name] > 0);
    const data = labels.map(name => categoryCounts[name]);
    
    // Generate colors dynamically based on number of categories
    const backgroundColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
      '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#F94144'
    ];
    
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: backgroundColors.slice(0, labels.length)
      }]
    };
  };

  const getRevenueChartData = () => {
    // Calculate revenue per instructor from filtered courses
    const instructorRevenue = {};
    
    filteredCourses.forEach(course => {
      if (course.instructor && course.instructor._id) {
        const instructorId = course.instructor._id;
        const instructorName = `${course.instructor.firstName} ${course.instructor.lastName}`;
        const revenue = (course.price * 0.8) * course.studentsEnrolledCount; // 80% to instructor
        
        if (!instructorRevenue[instructorId]) {
          instructorRevenue[instructorId] = { name: instructorName, revenue: 0 };
        }
        instructorRevenue[instructorId].revenue += revenue;
      }
    });
    
    // Convert to arrays for chart
    const instructorData = Object.values(instructorRevenue);
    
    return {
      labels: instructorData.map(inst => inst.name),
      datasets: [{
        label: 'Instructor Revenue (₹)',
        data: instructorData.map(inst => Math.round(inst.revenue)),
        backgroundColor: '#36A2EB'
      }]
    };
  };

  const getRevenueAdminChartData = () => {
    // Calculate admin revenue (20%) for filtered courses
    const totalAdminRevenue = filteredCourses.reduce((sum, course) => {
      return sum + ((course.price * 0.2) * course.studentsEnrolledCount);
    }, 0);
    
    return {
      labels: ['Admin Revenue'],
      datasets: [{
        label: 'Admin Revenue (₹)',
        data: [Math.round(totalAdminRevenue)],
        backgroundColor: '#FF6384'
      }]
    };
  };

  // The chart options for consistent styling
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== undefined) {
              label += new Intl.NumberFormat('en-IN', { 
                style: 'currency', 
                currency: 'INR',
                minimumFractionDigits: 0
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    }
  };

  // Determine if we should show course data or loading state
  const showCourseData = !fetchingData && filteredCourses.length > 0;
  const showNoData = !fetchingData && !loading && filteredCourses.length === 0;
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Course Analytics Report
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleFilterSubmit}>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  slotProps={{
                    textField: { 
                      fullWidth: true,
                      error: startDate && endDate && dayjs(startDate).isAfter(endDate),
                      helperText: startDate && endDate && dayjs(startDate).isAfter(endDate) ? 
                        "Start date must be before end date" : ""
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  slotProps={{
                    textField: { 
                      fullWidth: true,
                      error: startDate && endDate && dayjs(startDate).isAfter(endDate)
                    }
                  }}
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
                  <MenuItem value="">All Categories</MenuItem>
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
                  <MenuItem value="">All Instructors</MenuItem>
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
                  label="Sort By"
                  value={popularityFilter}
                  onChange={handleSortChange}
                >
                  <MenuItem value="">Default</MenuItem>
                  <MenuItem value="mostEnrolled">Most Enrolled</MenuItem>
                  <MenuItem value="highestRevenue">Highest Revenue</MenuItem>
                  <MenuItem value="recent">Recently Added</MenuItem>
                </TextField>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  startIcon={<FilterAlt />}
                  sx={{ height: '56px' }}
                >
                  {loading ? 'Generating Report...' : 'Apply Filters & Generate Report'}
                </Button>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleResetFilters}
                  disabled={loading}
                  startIcon={<ClearAll />}
                  sx={{ height: '56px' }}
                >
                  Reset All Filters
                </Button>
              </Grid>
            </Grid>
          </form>

          {fetchingData && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column' }}>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="body1">Loading course data...</Typography>
            </Box>
          )}
          
          {showNoData && (
            <Alert severity="info" sx={{ mb: 3 }}>
              No courses match the selected filters. Try adjusting your criteria.
            </Alert>
          )}

          {showCourseData && (
            <>
              {/* Summary Statistics */}
              <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
                <Grid item xs={12} md={3}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                    <Typography variant="subtitle2" color="textSecondary">Total Courses</Typography>
                    <Typography variant="h4">{filteredCourses.length}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                    <Typography variant="subtitle2" color="textSecondary">Active Courses</Typography>
                    <Typography variant="h4">
                      {filteredCourses.filter(c => c.status === 'Published').length}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                    <Typography variant="subtitle2" color="textSecondary">Total Students</Typography>
                    <Typography variant="h4">
                      {filteredCourses.reduce((sum, c) => sum + c.studentsEnrolledCount, 0)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                    <Typography variant="subtitle2" color="textSecondary">Total Revenue</Typography>
                    <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaIndianRupeeSign size={18} style={{ marginRight: '4px' }} />
                      {filteredCourses.reduce((sum, c) => sum + (c.price * c.studentsEnrolledCount), 0).toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Export buttons */}
              <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PictureAsPdf />}
                  onClick={downloadPDF}
                >
                  Download PDF Report
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<FileDownload />}
                  onClick={downloadExcel}
                >
                  Download Excel Report
                </Button>
              </Stack>

              {/* Charts */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Courses by Category
                    </Typography>
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Pie 
                        ref={pieChartRef} 
                        data={getCategoryChartData()}
                        options={{
                          ...chartOptions,
                          plugins: {
                            ...chartOptions.plugins,
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  const label = context.label || '';
                                  const value = context.parsed || 0;
                                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                  return `${label}: ${value} courses (${percentage}%)`;
                                }
                              }
                            }
                          }
                        }} 
                      />
                    )}
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Revenue by Instructor
                    </Typography>
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Bar 
                        ref={barChartRef} 
                        data={getRevenueChartData()}
                        options={{
                          ...chartOptions,
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: { display: true, text: 'Revenue (₹)' }
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
                      Admin Revenue
                    </Typography>
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Bar 
                        ref={adminChartRef} 
                        data={getRevenueAdminChartData()}
                        options={{
                          ...chartOptions,
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: { display: true, text: 'Revenue (₹)' }
                            }
                          }
                        }} 
                      />
                    )}
                  </Paper>
                </Grid>
              </Grid>

              {/* Course Data Table */}
              <Typography variant="h5" gutterBottom sx={{ mt: 2, mb: 1 }}>
                Course Details
              </Typography>
              
              <TableContainer component={Paper} elevation={2}>
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
                            label={course.category?.name || 'N/A'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FaIndianRupeeSign />
                            {course.price}
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
            </>
          )}
        </Paper>
        
        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default AdminCourseReport;