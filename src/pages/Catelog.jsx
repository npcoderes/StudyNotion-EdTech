import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getCatalogPageData } from "../services/operations/pageAndComponentData";
import { apiConnector } from "../services/apiconnector";
import { categories } from "../services/apis";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Loading from "../components/common/Loading";
import Card from "../components/cors/catalog/Card";
import Course_Slider from "../components/cors/catalog/Course_Slider";
import Footer from "../components/common/Footer";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import debounce from 'lodash/debounce';

const Catelog = () => {
  const { catalogName } = useParams();
  console.log(catalogName);
  const [catalogPageData, setCataLogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [most, setMost] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const res = await apiConnector("GET", categories.CATEGORIES_API);
      const category_id = res?.data?.data.filter(
        (ct) => ct.name.split(" ").join("-") === catalogName
      )[0]._id;
      setCategoryId(category_id);
    };
    getCategories();
  }, [catalogName]);

  useEffect(() => {
    if (categoryId) {
      (async () => {
        setLoading(true);
        const toastid = toast.loading("Loading...");
        try {
          const res = await getCatalogPageData(categoryId);
          console.log("CATALOG PAGE DATA API RESPONSE............", res);
          setCataLogPageData(res);
          toast.dismiss(toastid);
        } catch (error) {
          toast.dismiss(toastid);
          toast.error("Error fetching catalog page data");
          // console.log(error);
        }
        setLoading(false);
      })();
    }
  }, [categoryId]);

  useEffect(() => {
    if (catalogPageData?.selectedCategory?.courses) {
      setFilteredCourses(catalogPageData.selectedCategory.courses);
    }
  }, [catalogPageData]);

  const debouncedSearch = debounce((query) => {
    if (!query) {
      setFilteredCourses(catalogPageData?.selectedCategory?.courses || []);
      return;
    }
    
    

const allCourses = [
  ...(catalogPageData?.selectedCategory?.courses || []),
  ...(catalogPageData?.mostSellingCourses || []),
  ...(catalogPageData?.differentCategory?.courses || []),
];

const filtered = allCourses.filter(course =>
  course.courseName.toLowerCase().includes(query.toLowerCase())
);
    setFilteredCourses(filtered);
  }, 300);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.6, 0.01, 0.3, 0.9] }}
        exit={{ opacity: 0 }}
      >
        <Loading />
      </motion.div>
    );
  }

  if (!loading && !catalogPageData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.6, 0.01, 0.3, 0.9] }}
        exit={{ opacity: 0 }}
        className="text-gray-700 text-4xl flex justify-center items-center mt-[20%] max-sm:text-sm"
      >
        No Courses found for selected Category 😓
      </motion.div>
    );
  }

  const searchSection = (
    <div className="relative w-full max-w-md mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            debouncedSearch(e.target.value);
          }}
          className="w-full px-4 py-2 pl-10 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 text-gray-200"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
    </div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.6, 0.01, 0.3, 0.9] }}
        exit={{ opacity: 0 }}
        className="relative border-b-[1px] border-gray-300 pb-7 bg-[#080707] mt-16 overflow-hidden mb-3"
      >
        {/* Animated star background */}
        <div className="absolute inset-0">
          <div className="stars"></div>
          <div className="stars2"></div>
          <div className="stars3"></div>
        </div>

        <div className="relative w-11/12 max-w-maxContent flex flex-col mx-auto text-gray-800 mt-3 ">
          {/* header part  */}
          <div className="flex flex-col lg:mt-10 mt-3 gap-3 ">
            <p className="text-richblack-400 uppercase  text-[12px] justify-start z-20">
              Home / catalog /{"   "}
              <span className="text-[#422faf] font-bold text-sm">{catalogName}</span>
            </p>
            <div className="flex flex-col gap-3">
              <p className="text-3xl text-pure-greys-50">
                {catalogPageData?.selectedCategory?.name} 📚
              </p>
              <p className="text-richblack-800">{catalogPageData?.selectedCategory?.description}</p>
            </div>
          </div>
        </div>
      </motion.div>
      {searchSection}
      {/* course part  */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.6, 0.01, 0.3, 0.9] }}
        exit={{ opacity: 0 }}
        className="w-11/12 lg:max-w-maxContent flex flex-col mx-auto gap-5 text-gray-800 mt-3 py-12"
      >
        <p className="text-gray-600 text-3xl ">
          {searchQuery ? 'Search Results' : 'Courses to get you started'}
        </p>
        <div className="flex gap-x-5 text-gray-500 border-b-[1px] border-gray-300 pb-4 text-sm">
          <p
            className={`${
              most ? "text-blue-600 border-blue-600 border-b-[1px]" : ""
            } cursor-pointer pb-4 transition-all duration-200`}
            onClick={() => setMost(true)}
          >
            Most Popular
          </p>
          <p
            className={`${
              !most && "text-blue-600 border-blue-600 border-b-[1px]"
            } cursor-pointer pb-4 transition-all duration-200`}
            onClick={() => setMost(false)}
          >
            New
          </p>
        </div>

        {/* courses  */}
        <div className=""> 
          <Course_Slider Courses={filteredCourses}  objectFit={"object-cover"}/>
        </div>

        {/* Section 2 */}
        <div className="mx-auto box-content w-full max-w-maxContentTab py-12 lg:max-w-maxContent">
          <div className=" text-3xl py-3">
            Top courses in {catalogPageData?.differentCategory?.name}
          </div>
          <div>
            <Course_Slider
              Courses={catalogPageData?.differentCategory?.courses}
            />
          </div>
        </div>

        {/* section-3  */}
        <div className="mx-auto box-content w-full max-w-maxContentTab py-12 lg:max-w-maxContent ">
          <div className="text-gray-600 text-3xl py-3">Frequently Bought</div>
          <div className="py-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {catalogPageData?.mostSellingCourses
                ?.slice(0, 4)
                .map((course, i) => (
                  <Card course={course} key={i} Height={"h-[300px]"} objectFit={"object-fill"} />
                ))}
            </div>
          </div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default Catelog;
