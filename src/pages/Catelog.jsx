import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import toast from "react-hot-toast";
import debounce from 'lodash/debounce';

// API and Services
import { getCatalogPageData } from "../services/operations/pageAndComponentData";
import { apiConnector } from "../services/apiconnector";
import { categories } from "../services/apis";

// Components
import Loading from "../components/common/Loading";
import Card from "../components/cors/catalog/Card";
import Course_Slider from "../components/cors/catalog/Course_Slider";
import Footer from "../components/common/Footer";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4, ease: [0.6, 0.01, 0.3, 0.9] }
  },
  exit: { opacity: 0 }
};

const Catelog = () => {
  // State variables
  const { catalogName } = useParams();
  const [catalogPageData, setCataLogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch category ID based on catalog name
  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        const category = res?.data?.data.find(
          (ct) => ct.name.split(" ").join("-") === catalogName
        );
        
        if (category) {
          setCategoryId(category._id);
        } else {
          toast.error("Category not found");
        }
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    getCategories();
  }, [catalogName]);

  // Fetch catalog data once we have the category ID
  useEffect(() => {
    if (categoryId) {
      (async () => {
        const toastid = toast.loading("Loading courses...");
        try {
          const res = await getCatalogPageData(categoryId);
          setCataLogPageData(res);
          toast.dismiss(toastid);
        } catch (error) {
          toast.dismiss(toastid);
          toast.error("Error fetching catalog data");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [categoryId]);

  // Set initial filtered courses
  useEffect(() => {
    if (catalogPageData?.selectedCategory?.courses) {
      setFilteredCourses(catalogPageData.selectedCategory.courses);
    }
  }, [catalogPageData]);

  // Debounced search function
  const debouncedSearch = debounce((query) => {
    if (!query) {
      setFilteredCourses(catalogPageData?.selectedCategory?.courses || []);
      return;
    }
    
    // Get all courses from different sections
    const allCoursesWithDuplicates = [
      ...(catalogPageData?.selectedCategory?.courses || []),
      ...(catalogPageData?.mostSellingCourses || []),
      ...(catalogPageData?.differentCategory?.courses || []),
    ];
    
    // Remove duplicates by creating a Map keyed by course _id
    const uniqueCoursesMap = new Map();
    allCoursesWithDuplicates.forEach(course => {
      if (course && course._id && !uniqueCoursesMap.has(course._id)) {
        uniqueCoursesMap.set(course._id, course);
      }
    });
    
    // Convert Map values back to array and filter by search query
    const uniqueCourses = Array.from(uniqueCoursesMap.values());
    const filtered = uniqueCourses.filter(course =>
      course.courseName.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredCourses(filtered);
  }, 300);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    if (!catalogPageData?.selectedCategory?.courses) return;
    
    const courses = [...catalogPageData.selectedCategory.courses];
    
    if (tab === "popular") {
      setFilteredCourses(courses.sort((a, b) => b.ratingAndReviews?.length - a.ratingAndReviews?.length));
    } else if (tab === "new") {
      setFilteredCourses(courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
  };

  // Loading state
  if (loading) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="min-h-screen flex items-center justify-center"
      >
        <Loading />
      </motion.div>
    );
  }

  // No courses found state
  if (!loading && !catalogPageData) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex justify-center items-center min-h-[80vh] text-center px-4"
      >
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-8 shadow-sm max-w-md">
          <div className="text-[#111827] text-2xl font-semibold mb-3">No Courses Found</div>
          <p className="text-[#6B7280] mb-6">We couldn't find any courses for this category. Please try another category.</p>
          <Link 
            to="/catalog" 
            className="inline-block px-6 py-2.5 bg-[#422FAF] hover:bg-[#3B27A1] text-white rounded-lg transition-colors duration-300"
          >
            Browse Categories
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Hero Section with Light Theme */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-gradient-to-b from-[#F9FAFB] to-[#F3F4F6] pt-24 pb-12 border-b border-[#E5E7EB]"
      >
        <div className="w-11/12 max-w-maxContent mx-auto">
          {/* Breadcrumb */}
          <div className="text-[#6B7280] text-sm mb-4">
            <Link to="/" className="hover:text-[#422faf] transition-colors">Home</Link> / 
            <Link to="/catalog" className="hover:text-[#422faf] transition-colors"> Catalog</Link> /{" "}
            <span className="text-[#422faf] font-medium">{catalogName.replace(/-/g, ' ')}</span>
          </div>
          
          {/* Category Title and Description */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
              {catalogPageData?.selectedCategory?.name} 
              <span className="ml-2">📚</span>
            </h1>
            <p className="text-[#4B5563] max-w-3xl leading-relaxed">
              {catalogPageData?.selectedCategory?.description}
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                className="w-full px-4 py-3 pl-10 text-[#111827] border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422faf] focus:border-transparent shadow-sm"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-[#9CA3AF]" />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#D1D5DB] rounded-lg bg-white hover:bg-[#F9FAFB] transition-colors text-[#4B5563]"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Course Content */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-11/12 max-w-maxContent mx-auto py-12"
      >
        {/* Course Tabs */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#111827]">
            {searchQuery ? 'Search Results' : 'Courses to get you started'}
          </h2>
          
          <div className="flex gap-x-4">
            <button
              className={`pb-2 px-2 font-medium text-base transition-all duration-200 border-b-2 ${
                activeTab === "popular" 
                  ? "text-[#422faf] border-[#422faf]" 
                  : "text-[#6B7280] border-transparent hover:text-[#111827]"
              }`}
              onClick={() => handleTabChange("popular")}
            >
              Most Popular
            </button>
            <button
              className={`pb-2 px-2 font-medium text-base transition-all duration-200 border-b-2 ${
                activeTab === "new" 
                  ? "text-[#422faf] border-[#422faf]" 
                  : "text-[#6B7280] border-transparent hover:text-[#111827]"
              }`}
              onClick={() => handleTabChange("new")}
            >
              Newest
            </button>
          </div>
        </div>

        {/* Show results count */}
        {searchQuery && (
          <p className="text-[#6B7280] mb-6">
            Found {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} for "{searchQuery}"
          </p>
        )}

        {/* Course Slider */}
        <div className="mb-16">
          {filteredCourses.length > 0 ? (
            <Course_Slider 
              Courses={filteredCourses} 
              objectFit={"object-cover"}
            />
          ) : (
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-8 text-center">
              <p className="text-[#6B7280]">No courses found. Try adjusting your search.</p>
            </div>
          )}
        </div>

        {/* Other Categories Section */}
        {catalogPageData?.differentCategory?.courses?.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-[#111827] mb-6 flex items-center">
              <span className="inline-block w-1 h-6 bg-[#422faf] rounded mr-3"></span>
              Top courses in {catalogPageData?.differentCategory?.name}
            </h2>
            <Course_Slider
              Courses={catalogPageData?.differentCategory?.courses}
            />
          </div>
        )}

        {/* Frequently Bought Section */}
        {catalogPageData?.mostSellingCourses?.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-[#111827] mb-6 flex items-center">
              <span className="inline-block w-1 h-6 bg-[#422faf] rounded mr-3"></span>
              Frequently Bought
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalogPageData?.mostSellingCourses
                ?.slice(0, 6)
                .map((course, i) => (
                  <Card 
                    course={course} 
                    key={course._id} 
                    Height={"h-[300px]"} 
                    objectFit={"object-cover"} 
                  />
                ))}
            </div>
          </div>
        )}
        
        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#422faf]/10 to-[#422faf]/5 rounded-xl p-8 mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-[#111827] mb-4">
              Can't find what you're looking for?
            </h3>
            <p className="text-[#4B5563] mb-6">
              We're constantly adding new courses. Join our newsletter to stay updated when new courses are added in {catalogName.replace(/-/g, ' ')}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2.5 rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#422faf] w-full sm:w-64"
              />
              <button className="bg-[#422faf] hover:bg-[#3B27A1] text-white px-6 py-2.5 rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default Catelog;