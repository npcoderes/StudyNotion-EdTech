import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { apiConnector } from "../services/apiconnector";
import { useSelector } from "react-redux";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons

const ManageCategory = () => {
  const {token}=useSelector(state => state.auth)
  const [categories, setCategories] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL
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
  console.log(categories) 

useEffect(()=>{
  showCategory()
},[])
  return (
    <>
      {/* section 1  */}
      <section className="my-4">
        {/* heder  */}
        <h1 className="text-4xl text-white  fonr-bold leading-5">
          Manage Categories
        </h1>
        {/* for add category  */}
        <form onSubmit={handleSubmit(addCategory)} className="my-5">
          <div className="my-2  py-4 w-full flex justify-between ">
            <div className="w-full flex flex-col  gap-4">
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Add Category"
                {...register("name", { required: true })}
                className="form-style w-10/12 "
              />
              {errors.category && (
                <span className="text-pink-500">Please enter category</span>
              )}
            </div>
            <button className=" bg-highlight-blue text-black rounded-md px-12 text-lg font-semibold h-14  ">
              Add
            </button>

          </div>

        </form>
      </section>

      {/* section 2  */}
      {/* show all categories */}
      <section className="my-4">
        <h2 className="text-2xl text-white font-semibold mb-8">
          Available Categories
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-richblack-700 p-4 rounded-lg shadow-md"
            >
              <p className="text-white text=xl">{cat.name}</p>
              <div className="flex gap-6 text-xl">
                <button className="text-highlight-blue hover:text-blue-700">
                  <FaEdit />
                </button>
                <button className="text-pink-500 hover:text-red-700">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </>
  );
};

export default ManageCategory;
