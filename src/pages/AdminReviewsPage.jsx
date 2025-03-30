import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Rating,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  LinearProgress,
  Pagination,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material';

import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
  ViewList as ViewListIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const { REACT_APP_BASE_URL } = process.env;

const AdminReviewsPage = () => {
  // State management
  const [tab, setTab] = useState(0); // 0: Dashboard, 1: All Reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [ratingStats, setRatingStats] = useState(null);

  const {token} = useSelector(state=>state.auth)

  // Fetch all courses for dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BASE_URL}/course/getAllCourses`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Courses",response.data.data)
        setCourses(response.data.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to fetch courses. Please try again.');
      }
    };

    fetchCourses();
    fetchAnalytics();
  }, []);

  // Fetch analytics data
  const sanitizeAnalyticsData = (data) => {
    if (!data) return null;
    
    // Ensure stats has all required properties
    const stats = data.stats || {};
    const sanitizedStats = {
      averageRating: stats.averageRating || 0,
      totalReviews: stats.totalReviews || 0,
      distribution: stats.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
    
    // Ensure topRatedCourses is an array
    const topRatedCourses = Array.isArray(data.topRatedCourses) ? 
      data.topRatedCourses.map(course => ({
        courseId: course.courseId || '',
        courseName: course.courseName || 'Unknown Course',
        averageRating: course.averageRating || 0,
        reviewCount: course.reviewCount || 0
      })) : [];
    
    // Ensure recentReviews is an array
    const recentReviews = Array.isArray(data.recentReviews) ? data.recentReviews : [];
    
    return {
      stats: sanitizedStats,
      topRatedCourses,
      recentReviews
    };
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${REACT_APP_BASE_URL}/admin/reviews/analytics`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Analytics", response.data.data);
      
      // Sanitize the data to handle missing values
      const sanitizedData = sanitizeAnalyticsData(response.data.data);
      setAnalytics(sanitizedData);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to fetch analytics data. Please try again.');
      setLoading(false);
      
      // Set default empty analytics structure
      setAnalytics({
        stats: {
          averageRating: 0,
          totalReviews: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        },
        topRatedCourses: [],
        recentReviews: []
      });
    }
  };

  // Fetch reviews based on selection
  useEffect(() => {
    if (tab === 1) {
      fetchReviews();
    }
  }, [tab, selectedCourse, currentPage]);

  const sanitizeRatingStats = (stats) => {
    if (!stats) return null;
    
    return {
      averageRating: stats.averageRating || 0,
      ratingCount: stats.ratingCount || 0,
      distribution: stats.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      let url;
      
      if (selectedCourse) {
        url = `${REACT_APP_BASE_URL}/admin/reviews/course/${selectedCourse}?page=${currentPage}`;
      } else {
        url = `${REACT_APP_BASE_URL}/admin/reviews?page=${currentPage}`;
      }
      
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Reviews", response.data);
      
      // Ensure reviews is always an array
      const reviewsData = Array.isArray(response.data.reviews) ? response.data.reviews : [];
      setReviews(reviewsData);
      
      // Handle pagination data safely
      const pagination = response.data.pagination || {};
      setTotalPages(pagination.totalPages || 1);
      
      if (selectedCourse) {
        const sanitizedStats = sanitizeRatingStats(response.data.ratingStats);
        setRatingStats(sanitizedStats);
      } else {
        setRatingStats(null);
      }
      
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to fetch reviews. Please try again.');
      setLoading(false);
      setReviews([]);
    }
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setCurrentPage(1); // Reset pagination when changing tabs
  };

  // Handle course selection
  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    setCurrentPage(1); // Reset pagination when changing course
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSelectedCourse('');
    setCurrentPage(1);
  };

  // Handle review deletion dialog
  const handleDeleteDialogOpen = (review) => {
    setReviewToDelete(review);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setReviewToDelete(null);
  };

  // Handle review details dialog
  const handleDetailsDialogOpen = (review) => {
    setSelectedReview(review);
    setDetailsDialogOpen(true);
  };

  const handleDetailsDialogClose = () => {
    setDetailsDialogOpen(false);
    setSelectedReview(null);
  };

  // Delete review
  const handleDeleteReview = async () => {
    try {
      await axios.delete(`${REACT_APP_BASE_URL}/admin/reviews/${reviewToDelete._id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      // Refresh data
      if (tab === 0) {
        fetchAnalytics();
      } 
      
      fetchReviews();
      handleDeleteDialogClose();
    } catch (error) {
      console.error('Error deleting review:', error);
      setError('Failed to delete review. Please try again.');
      handleDeleteDialogClose();
    }
  };

  // Dashboard view
  const renderDashboard = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!analytics) {
      return (
        <Alert severity="info">
          No analytics data available
        </Alert>
      );
    }

    const { stats, topRatedCourses, recentReviews } = analytics;

    return (
      <>
        {/* Overall Stats */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1f2937' }}>
                  {stats.averageRating}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Rating 
                    value={stats.averageRating} 
                    precision={0.5} 
                    readOnly
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                  />
                </Box>
                <Typography variant="subtitle1" color="textSecondary">
                  Overall Rating
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1f2937' }}>
                  {stats.totalReviews}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Total Reviews
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Rating Distribution
                </Typography>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.distribution[rating];
                  const percentage = stats.totalReviews > 0 
                    ? Math.round((count / stats.totalReviews) * 100) 
                    : 0;
                    
                  return (
                    <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ mr: 1, width: '10px' }}>
                        {rating}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{ 
                          flexGrow: 1, 
                          height: 8, 
                          borderRadius: 1,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: rating >= 4 ? 'success.main' : (rating === 3 ? 'warning.main' : 'error.main')
                          } 
                        }}
                      />
                      <Typography variant="body2" sx={{ ml: 1, width: '40px' }}>
                        {count} ({percentage}%)
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Top Rated Courses and Recent Reviews */}
        <Grid container spacing={3}>
          {/* Top Rated Courses */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ height: '100%' }}>
              <Box sx={{ bgcolor: '#1f2937', p: 2 }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Top Rated Courses
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                {topRatedCourses.length > 0 ? (
                  topRatedCourses.map((course, index) => (
                    <Box key={course.courseId} sx={{ mb: 2, pb: 2, borderBottom: index < topRatedCourses.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {course.courseName}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating 
                            value={course.averageRating} 
                            precision={0.1} 
                            size="small" 
                            readOnly 
                          />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            ({course.averageRating.toFixed(1)})
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          {course.reviewCount} reviews
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Alert severity="info">No course ratings available</Alert>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Recent Reviews */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ height: '100%' }}>
              <Box sx={{ bgcolor: '#1f2937', p: 2 }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Recent Reviews
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                {recentReviews.length > 0 ? (
                  recentReviews.map((review) => (
                    <Box 
                      key={review._id} 
                      sx={{ 
                        mb: 2, pb: 2, 
                        borderBottom: '1px solid #f0f0f0',
                        '&:last-child': { borderBottom: 'none', mb: 0, pb: 0 }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {review?.user ? `${review.user.firstName || ''} ${review.user.lastName || ''}` : 'Unknown User'}
                        </Typography>
                        <Rating value={review?.rating || 0} size="small" readOnly />
                      </Box>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {review?.course?.courseName || 'Unknown Course'}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {review?.review || 'No review text provided'}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Button 
                          size="small" 
                          onClick={() => handleDetailsDialogOpen(review)}
                        >
                          View
                        </Button>
                        <Button 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteDialogOpen(review)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Alert severity="info">No recent reviews</Alert>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  };

  // Reviews list view
  const renderReviewsList = () => {
    return (
      <>
        {/* Filters */}
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Filter by Course"
                value={selectedCourse}
                onChange={handleCourseChange}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: <FilterIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              >
                <MenuItem value="">All Courses</MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.courseName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={handleResetFilters}
                  sx={{ mr: 2 }}
                >
                  Reset Filters
                </Button>
                <Button
                  variant="contained"
                  onClick={fetchReviews}
                >
                  Apply Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Course rating summary if a course is selected */}
        {selectedCourse && ratingStats && (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
                    {ratingStats.averageRating}
                  </Typography>
                  <Rating 
                    value={ratingStats.averageRating} 
                    precision={0.5} 
                    readOnly 
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="subtitle2" color="textSecondary">
                    Based on {ratingStats.ratingCount} reviews
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="subtitle2" gutterBottom>
                  Rating Distribution
                </Typography>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingStats.distribution[rating];
                  const percentage = ratingStats.ratingCount > 0 
                    ? Math.round((count / ratingStats.ratingCount) * 100) 
                    : 0;
                    
                  return (
                    <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ mr: 1, width: '10px' }}>
                        {rating}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{ 
                          flexGrow: 1, 
                          height: 8, 
                          borderRadius: 1,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: rating >= 4 ? 'success.main' : (rating === 3 ? 'warning.main' : 'error.main')
                          } 
                        }}
                      />
                      <Typography variant="body2" sx={{ ml: 1, width: '40px' }}>
                        {count} ({percentage}%)
                      </Typography>
                    </Box>
                  );
                })}
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Reviews Table */}
        {loading ? (
          <Box sx={{ width: '100%', mt: 3 }}>
            <LinearProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        ) : reviews.length === 0 ? (
          <Alert severity="info" sx={{ mt: 3 }}>
            No reviews found for the selected criteria.
          </Alert>
        ) : (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell>User</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Review</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={review?.user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName || 'User'}`} 
                          alt={`${review?.user?.firstName || ''} ${review?.user?.lastName || ''}`}
                          sx={{ mr: 2, width: 32, height: 32 }}
                        >
                          {review?.user?.firstName ? review.user.firstName.charAt(0) : 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {review?.user ? `${review.user.firstName || ''} ${review.user.lastName || ''}` : 'Unknown User'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {review?.user?.email || 'No email available'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={review?.course?.courseName || 'Unknown Course'}
                        size="small"
                        sx={{ 
                          bgcolor: '#e0f7fa', 
                          color: '#006064',
                          fontWeight: 'medium'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Rating value={review.rating} size="small" readOnly />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {review?.review || 'No review text provided'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDetailsDialogOpen(review)}
                          sx={{ mr: 1 }}
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Review">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteDialogOpen(review)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}
        {!loading && reviews.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </>
    );
  };

  // Main component render
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1f2937' }}>
          Course Reviews Management
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Manage and analyze student reviews and ratings for all courses.
        </Typography>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab 
              label="Analytics Dashboard" 
              icon={<DashboardIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Review Management" 
              icon={<ViewListIcon />} 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab panels */}
        <Box sx={{ mt: 3 }}>
          {tab === 0 && renderDashboard()}
          {tab === 1 && renderReviewsList()}
        </Box>
      </Paper>

      {/* Review Details Dialog */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={handleDetailsDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Review Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedReview && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Course
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {selectedReview?.course?.courseName || 'Unknown Course'}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    src={selectedReview?.user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${selectedReview?.user?.firstName || 'User'}`} 
                    alt={`${selectedReview?.user?.firstName || ''} ${selectedReview?.user?.lastName || ''}`}
                    sx={{ mr: 2 }}
                  >
                    {selectedReview?.user?.firstName ? selectedReview.user.firstName.charAt(0) : 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">
                      {selectedReview?.user ? `${selectedReview.user.firstName || ''} ${selectedReview.user.lastName || ''}` : 'Unknown User'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {selectedReview?.user?.email || 'No email available'}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Rating value={selectedReview?.rating || 0} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({selectedReview?.rating || 0}/5)
                  </Typography>
                </Box>
                
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Review
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedReview?.review || 'No review text provided'}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailsDialogClose}>Close</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={() => {
              handleDeleteDialogOpen(selectedReview);
              handleDetailsDialogClose();
            }}
            startIcon={<DeleteIcon />}
          >
            Delete Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this review? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteReview} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminReviewsPage;