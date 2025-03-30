import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';
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
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [ratings, setRatings] = useState(0);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Duration options
  const durationOptions = [
    { label: "0-2 hours", value: "short", min: 0, max: 2 },
    { label: "3-6 hours", value: "medium", min: 3, max: 6 },
    { label: "7-16 hours", value: "long", min: 7, max: 16 },
    { label: "17+ hours", value: "very-long", min: 17, max: 100 }
  ];
  
  // Level options
  const levelOptions = ["Beginner", "Intermediate", "Advanced"];

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
          console.log("Catalog Page Data", res);
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

  // Filter courses based on all criteria
  const applyFilters = () => {
    setIsFiltering(true);
    
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
    
    // Convert Map values back to array
    let courses = Array.from(uniqueCoursesMap.values());
    
    // Apply search query filter
    if (searchQuery) {
      courses = courses.filter(course =>
        course.courseName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply price range filter
    courses = courses.filter(course => {
      const price = course.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // Apply duration filter
    if (selectedDurations.length > 0) {
      courses = courses.filter(course => {
        // Convert course duration (assuming it's stored in hours)
        const courseDurationHours = course.courseContent?.reduce((total, section) => {
          return total + (section.subSection?.reduce((sectionTotal, subSection) => {
            // Assuming each subsection has a duration field in minutes, convert to hours
            return sectionTotal + ((subSection.timeDuration || 0) / 60);
          }, 0) || 0);
        }, 0) || 0;
        
        // Check if course duration falls within any selected duration range
        return selectedDurations.some(selectedDuration => {
          const option = durationOptions.find(opt => opt.value === selectedDuration);
          return option && courseDurationHours >= option.min && courseDurationHours <= option.max;
        });
      });
    }
    
    // Apply level filter
    if (selectedLevels.length > 0) {
      courses = courses.filter(course => 
        selectedLevels.includes(course.tag || "Beginner")
      );
    }
    
    // Apply rating filter
    if (ratings > 0) {
      courses = courses.filter(course => {
        // Calculate average rating
        const reviewsCount = course.ratingAndReviews?.length || 0;
        if (reviewsCount === 0) return false;
        
        const totalRating = course.ratingAndReviews?.reduce((sum, review) => {
          return sum + (review.rating || 0);
        }, 0) || 0;
        
        const averageRating = reviewsCount > 0 ? totalRating / reviewsCount : 0;
        return averageRating >= ratings;
      });
    }
    
    // Apply sorting based on active tab
    if (activeTab === "popular") {
      courses.sort((a, b) => (b.ratingAndReviews?.length || 0) - (a.ratingAndReviews?.length || 0));
    } else if (activeTab === "new") {
      courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    setFilteredCourses(courses);
    setIsFiltering(false);
  };
  
  // Apply filters when filter parameters change
  useEffect(() => {
    // Skip the initial render
    if (catalogPageData?.selectedCategory?.courses) {
      applyFilters();
    }
  }, [searchQuery, priceRange, selectedDurations, selectedLevels, ratings, activeTab]);

  // Debounced search function
  const debouncedSearch = debounce((query) => {
    setSearchQuery(query);
  }, 300);
  
  // Reset all filters
  const resetFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedDurations([]);
    setSelectedLevels([]);
    setRatings(0);
    setSearchQuery("");
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Handle duration selection
  const handleDurationChange = (value) => {
    setSelectedDurations(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };
  
  // Handle level selection
  const handleLevelChange = (value) => {
    setSelectedLevels(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
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
                  debouncedSearch(e.target.value);
                }}
                className="w-full px-4 py-3 pl-10 text-[#111827] border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422faf] focus:border-transparent shadow-sm"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-[#9CA3AF]" />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 text-[#111827] border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB] transition-colors shadow-sm"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span>Filters</span>
              {(selectedDurations.length > 0 || selectedLevels.length > 0 || ratings > 0 || priceRange[0] > 0 || priceRange[1] < 10000) && (
                <span className="bg-[#422faf] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                  {selectedDurations.length + selectedLevels.length + (ratings > 0 ? 1 : 0) + 
                  ((priceRange[0] > 0 || priceRange[1] < 10000) ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
          
          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 bg-white rounded-lg border border-[#E5E7EB] shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-[#111827]">Filters</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={resetFilters}
                      className="text-[#6B7280] hover:text-[#111827] text-sm font-medium transition-colors"
                    >
                      Reset All
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-1 rounded-full hover:bg-[#F3F4F6] transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5 text-[#6B7280]" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Price Range Filter */}
                  <div>
                    <h4 className="text-[#111827] font-medium mb-3">Price Range</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-[#6B7280]">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="500"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#422faf]"
                      />
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="500"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#422faf]"
                      />
                    </div>
                  </div>
                  
                  {/* Duration Filter */}
                  <div>
                    <h4 className="text-[#111827] font-medium mb-3">Course Duration</h4>
                    <div className="space-y-2">
                      {durationOptions.map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedDurations.includes(option.value)}
                            onChange={() => handleDurationChange(option.value)}
                            className="w-4 h-4 text-[#422faf] border-[#D1D5DB] rounded focus:ring-[#422faf]"
                          />
                          <span className="text-[#4B5563]">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Level Filter */}
                  <div>
                    <h4 className="text-[#111827] font-medium mb-3">Course Level</h4>
                    <div className="space-y-2">
                      {levelOptions.map((level) => (
                        <label key={level} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedLevels.includes(level)}
                            onChange={() => handleLevelChange(level)}
                            className="w-4 h-4 text-[#422faf] border-[#D1D5DB] rounded focus:ring-[#422faf]"
                          />
                          <span className="text-[#4B5563]">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Ratings Filter */}
                  <div>
                    <h4 className="text-[#111827] font-medium mb-3">Ratings</h4>
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((star) => (
                        <label key={star} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="rating"
                            checked={ratings === star}
                            onChange={() => setRatings(star)}
                            className="w-4 h-4 text-[#422faf] border-[#D1D5DB] focus:ring-[#422faf]"
                          />
                          <div className="flex items-center">
                            {Array(5).fill(0).map((_, index) => (
                              <svg 
                                key={index}
                                className={`w-4 h-4 ${index < star ? 'text-[#F59E0B]' : 'text-[#D1D5DB]'}`}
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-1 text-[#4B5563]">& up</span>
                          </div>
                        </label>
                      ))}
                      {ratings > 0 && (
                        <button
                          onClick={() => setRatings(0)}
                          className="text-[#422faf] text-sm font-medium hover:underline mt-1"
                        >
                          Clear rating filter
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
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
            {isFiltering 
              ? 'Filtering courses...' 
              : searchQuery || selectedDurations.length > 0 || selectedLevels.length > 0 || ratings > 0 || priceRange[0] > 0 || priceRange[1] < 10000
                ? `${filteredCourses.length} course${filteredCourses.length !== 1 ? 's' : ''} found` 
                : 'Courses to get you started'}
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

        {/* Active Filters */}
        {(selectedDurations.length > 0 || selectedLevels.length > 0 || ratings > 0 || priceRange[0] > 0 || priceRange[1] < 10000) && (
          <div className="mb-6 flex flex-wrap gap-2">
            {priceRange[0] > 0 || priceRange[1] < 10000 ? (
              <div className="bg-[#F3F4F6] px-3 py-1.5 rounded-full flex items-center gap-2 text-sm text-[#4B5563]">
                <span>₹{priceRange[0]} - ₹{priceRange[1]}</span>
                <button 
                  onClick={() => setPriceRange([0, 10000])} 
                  className="w-4 h-4 rounded-full bg-[#9CA3AF] flex items-center justify-center hover:bg-[#6B7280]"
                >
                  <XMarkIcon className="w-3 h-3 text-white" />
                </button>
              </div>
            ) : null}
            
            {selectedDurations.map(duration => {
              const option = durationOptions.find(opt => opt.value === duration);
              return (
                <div key={duration} className="bg-[#F3F4F6] px-3 py-1.5 rounded-full flex items-center gap-2 text-sm text-[#4B5563]">
                  <span>{option?.label}</span>
                  <button 
                    onClick={() => handleDurationChange(duration)} 
                    className="w-4 h-4 rounded-full bg-[#9CA3AF] flex items-center justify-center hover:bg-[#6B7280]"
                  >
                    <XMarkIcon className="w-3 h-3 text-white" />
                  </button>
                </div>
              );
            })}
            
            {selectedLevels.map(level => (
              <div key={level} className="bg-[#F3F4F6] px-3 py-1.5 rounded-full flex items-center gap-2 text-sm text-[#4B5563]">
                <span>{level}</span>
                <button 
                  onClick={() => handleLevelChange(level)} 
                  className="w-4 h-4 rounded-full bg-[#9CA3AF] flex items-center justify-center hover:bg-[#6B7280]"
                >
                  <XMarkIcon className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
            
            {ratings > 0 && (
              <div className="bg-[#F3F4F6] px-3 py-1.5 rounded-full flex items-center gap-2 text-sm text-[#4B5563]">
                <div className="flex items-center">
                  {Array(5).fill(0).map((_, index) => (
                    <svg 
                      key={index}
                      className={`w-3.5 h-3.5 ${index < ratings ? 'text-[#F59E0B]' : 'text-[#D1D5DB]'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1">& up</span>
                </div>
                <button 
                  onClick={() => setRatings(0)} 
                  className="w-4 h-4 rounded-full bg-[#9CA3AF] flex items-center justify-center hover:bg-[#6B7280]"
                >
                  <XMarkIcon className="w-3 h-3 text-white" />
                </button>
              </div>
            )}
            
            <button 
              onClick={resetFilters}
              className="text-[#422faf] text-sm font-medium hover:underline flex items-center"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Course Results */}
        <div className="mb-16">
          {filteredCourses.length > 0 ? (
            <Course_Slider 
              Courses={filteredCourses} 
              objectFit={"object-cover"}
            />
          ) : (
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-8 text-center">
              <p className="text-[#6B7280]">No courses found. Try adjusting your filters.</p>
              {(searchQuery || selectedDurations.length > 0 || selectedLevels.length > 0 || ratings > 0 || priceRange[0] > 0 || priceRange[1] < 10000) && (
                <button
                  onClick={resetFilters}
                  className="mt-4 text-[#422faf] font-medium hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Other Categories Section */}
        {catalogPageData?.differentCategory?.courses?.length > 0 && !searchQuery && 
         selectedDurations.length === 0 && selectedLevels.length === 0 && ratings === 0 && 
         priceRange[0] === 0 && priceRange[1] === 10000 && (
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
        {catalogPageData?.mostSellingCourses?.length > 0 && !searchQuery && 
         selectedDurations.length === 0 && selectedLevels.length === 0 && ratings === 0 && 
         priceRange[0] === 0 && priceRange[1] === 10000 && (
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