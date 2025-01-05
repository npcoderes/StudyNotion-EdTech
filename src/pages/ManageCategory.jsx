import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { apiConnector } from "../services/apiconnector";
import { useSelector } from "react-redux";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  Divider,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';


const ManageCategory = () => {
  const {token}=useSelector(state => state.auth)
  const [categories, setCategories] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL

  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, categoryId: null });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [category, setCategory] = useState();

  const addCategory =async (data) => {
    try {
      const response = await apiConnector('POST', BASE_URL+'/course/createCategory',  data , { Authorization: `Bearer ${token}`,});

      if (response.data.success) {
        toast.success("Category added successfully");
        console.log("Category details: ", response.data);
        showCategory()
      } else {
        toast.error(response.data.message || "Failed to add category");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error adding category: ", error);
    }
  };

  const showCategory =async()=>{
    try{
          const response = await apiConnector('GET', BASE_URL+'/course/showAllCategories', null, { Authorization: `Bearer ${token}`,});
          if(response.data.success)
          {
            setCategories(response.data.data);
            
            console.log("Category details: ", response.data);
          }
          else{
            toast.error(response.data.message || "Failed to show category");
          }
    }catch(error)
    {
      toast.error("An error occurred. Please try again.");
      console.error("Error showing category: ", error);
    }
  }

  const deactiveCategory =async (id) => {
    try {
      const response = await apiConnector('POST', BASE_URL+'/course/deactiveCategory',  {categoryId:id} , { Authorization: `Bearer ${token}`,});
      if (response.data.success) {
        toast.success("Category deactivated successfully");
        console.log("Category details: ", response.data);
        showCategory()
      } else {
        toast.error(response.data.message || "Failed to delete category");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error deleting category: ", error);
    }
  };
  const activeCategory =async (id) => {
    try {
      const response = await apiConnector('POST', BASE_URL+'/course/updateCategory',  {categoryId:id,Active:true} , { Authorization: `Bearer ${token}`,});
      if (response.data.success) {
        toast.success("Category activated successfully");
        console.log("Category details: ", response.data);
        showCategory()
      } else {
        toast.error(response.data.message || "Failed to activate category");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error activating category: ", error);
    }
  };

  console.log(categories) 

useEffect(()=>{
  showCategory()
},[])
  return (
    <>
<Box sx={{ p: 3 }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Manage Categories
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Categories</Typography>
                <Typography variant="h4">{categories.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Active Categories</Typography>
                <Typography variant="h4">
                  {categories.filter(cat => cat.Active).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Add Category Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit(addCategory)}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Category Name"
                variant="outlined"
                error={Boolean(errors.name)}
                helperText={errors.name && "Please enter category name"}
                {...register("name", { required: true })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ height: '56px' }}
                fullWidth
              >
                Add Category
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Categories List */}
      {loading ? (
        <LinearProgress />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={2}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6">{category.name}</Typography>
                      <Chip
                        label={category.Active ? "Active" : "Inactive"}
                        color={category.Active ? "success" : "error"}
                        size="small"
                      />
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => activeCategory(category._id)}
                        color={category.Active ? "error" : "success"}
                      >
                        {category.active ? <InactiveIcon /> : <ActiveIcon />}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setDeleteDialog({ open: true, categoryId: category._id })}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      )}

      {/* Deactive Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, categoryId: null })}>
        <DialogTitle>Deactive Category</DialogTitle>
        <DialogContent>
          Are you sure you want to Deactive this category?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, categoryId: null })}>Cancel</Button>
          <Button
            onClick={() => {
              deactiveCategory(deleteDialog.categoryId);
              setDeleteDialog({ open: false, categoryId: null });
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </>
  );
};

export default ManageCategory;
