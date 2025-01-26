import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  Stack,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Cancel as DeactivateIcon,
  Block as RejectIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { DownloadIcon } from 'lucide-react';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const AdminInstructorManagement = () => {
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [deactivateDialog, setDeactivateDialog] = useState({ open: false, instructorId: null });

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/admin/notApprovedUser`);
      console.log('Fetched instructors:', response.data);
      setInstructors(response.data);
      setFilteredInstructors(response.data);
    } catch (error) {
      setError('Error fetching instructors');
      console.error('Error fetching instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveInstructor = async (id) => {
    console.log('Approving instructor:', id);
    let tid = toast.loading('Approving instructor...');
    try {
      const response = await axios.post(`${BASE_URL}/admin/approveUser`, { userId: id });
      console.log('Approved instructor:', response);
      toast.dismiss(tid);
      toast.success('Instructor approved successfully');
      setInstructors(instructors.filter((instructor) => instructor._id !== id));
      setFilteredInstructors(filteredInstructors.filter((instructor) => instructor._id !== id));
    } catch (error) {
      toast.dismiss(tid);
      toast.error('Error approving instructor');
      console.error('Error approving instructor', error);
    }
  };

  const deactivateInstructor = async (id) => {
    let tid = toast.loading('Deactivating instructor...');
    try {
      const response = await axios.post(`${BASE_URL}/admin/deactivateUser`, { id });
      console.log('Deactivated instructor:', response.data);
      toast.dismiss(tid);
      toast.success('Instructor deactivated successfully');
      setInstructors(instructors.filter((instructor) => instructor._id !== id));
      setFilteredInstructors(filteredInstructors.filter((instructor) => instructor._id !== id));
    } catch (error) {
      toast.dismiss(tid);
      toast.error('Error deactivating instructor');
      console.error('Error deactivating instructor', error);
    }
  };

  const deapproveInstructor = async (id) => {
    console.log('Deapproving instructor:', id);
    let tid = toast.loading('Deapproving instructor...');
    try {
      const response = await axios.post(`${BASE_URL}/admin/deapproveUser`, { userId: id });
      console.log('Deapproved instructor:', response);
      toast.dismiss(tid);
      toast.success('Instructor deapproved successfully');
      setInstructors(instructors.filter((instructor) => instructor._id !== id));
      setFilteredInstructors(filteredInstructors.filter((instructor) => instructor._id !== id));
    } catch (error) {
      toast.dismiss(tid);
      toast.error('Error deapproving instructor');
      console.error('Error deapproving instructor', error);
    }
  }


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = instructors.filter((instructor) =>
      `${instructor.firstName} ${instructor.lastName}`.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredInstructors(filtered);
  };

  const handleViewDetails = (instructor) => {
    setSelectedInstructor(instructor);
  };

  const handleCloseDetails = () => {
    setSelectedInstructor(null);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              bgcolor: 'primary.light',
              color: 'white',
              transition: '0.3s',
              '&:hover': { transform: 'translateY(-5px)' }
            }}>
              <CardContent>
                <Typography variant="h6">Total Instructors</Typography>
                <Typography variant="h3">{filteredInstructors.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Add more stat cards */}
        </Grid>

        {/* Enhanced Search Bar */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            background: 'linear-gradient(45deg, #f3f4f6 30%, #fff 90%)'
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search Instructors"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'primary.main' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>

          </Grid>
        </Paper>

        {/* Loading and Error States */}
        {loading && (
          <Box sx={{ width: '100%', mb: 4 }}>
            <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
          </Box>
        )}
        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

        {/* Instructor Grid */}
        <Grid container spacing={3}>
          {filteredInstructors.map((instructor) => (
            <Grid item xs={12} sm={6} md={4} key={instructor._id}>
              <Card sx={{
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
              }}>
                <CardContent>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Avatar
                      src={instructor.image}
                      alt={instructor.firstName}
                      sx={{ width: 64, height: 64 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {instructor.firstName} {instructor.lastName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {instructor.email}
                      </Typography>
                      <Chip
                        size="small"
                        label={instructor.status}
                        color={instructor.status === 'Approved' ? 'success' : 'warning'}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 3 }}
                    justifyContent="space-between"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ApproveIcon />}
                      onClick={() => approveInstructor(instructor._id)}
                      size="small"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<RejectIcon />}
                      onClick={() => deapproveInstructor(instructor._id)}
                      size="small"
                    >
                      Reject
                    </Button>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewDetails(instructor)}
                    >
                      <PersonIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Enhanced Instructor Details Dialog */}
        {selectedInstructor && (
          <Dialog
            open={Boolean(selectedInstructor)}
            onClose={handleCloseDetails}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
              Instructor Profile
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Avatar
                    src={selectedInstructor?.image}
                    sx={{ width: 200, height: 200, mx: 'auto' }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h5" gutterBottom>
                    {selectedInstructor.firstName} {selectedInstructor.lastName}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" paragraph>
                    {selectedInstructor.email}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {/* {selectedInstructor.bio} */}
                  </Typography>

                  {/* Documents Section */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Instructor Documents:
                    </Typography>
                    {selectedInstructor.documents ? (
                      <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <iframe
                          src={`${selectedInstructor.documents}`}
                          style={{ width: '100%', height: '300px', border: 'none' }}
                          title="Instructor Documents"
                        />
                        <Button
                          startIcon={<DownloadIcon />}
                          onClick={() => window.open(selectedInstructor.documents, '_blank')}
                          sx={{ mt: 1 }}
                        >
                          View Full Document
                        </Button>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No documents uploaded
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <button onClick={handleCloseDetails} className='btn btn-error'>Close</button>

            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Container>
  );
};

export default AdminInstructorManagement;