import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchUserCertificates, downloadCertificate } from '../../../../services/operations/certificateAPI';
import { FaDownload, FaEye, FaShare, FaAward, FaSearch, FaSortAmountDown } from 'react-icons/fa';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyCertificates() {
  const { token } = useSelector((state) => state.auth);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'courseNameAsc', 'scoreDesc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    const getCertificates = async () => {
      try {
        setLoading(true);
        const response = await fetchUserCertificates(token);
        if (response.success) {
          setCertificates(response.data);
          console.log("Certificates fetched successfully:", response.data);
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
        toast.error("Failed to load certificates");
      } finally {
        setLoading(false);
      }
    };

    getCertificates();
  }, [token]);

  const handleDownload = async (certificateId) => {
    try {
      toast.loading("Preparing your certificate...");
      await downloadCertificate(certificateId, token);
      toast.dismiss();
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading certificate:", error);
      toast.error("Failed to download certificate");
    }
  };

  const handleShare = async (certificateId) => {
    try {
      const shareUrl = `${window.location.origin}/certificate/verify/${certificateId}`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'My Course Certificate',
          text: 'Check out my course completion certificate!',
          url: shareUrl,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Certificate link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing certificate:", error);
      toast.error("Could not share certificate");
    }
  };

  const handleView = (certificateId) => {
    window.open(`/certificate/view/${certificateId}`, '_blank');
  };

  // Filter and sort certificates
  const filteredCertificates = certificates
    .filter(cert => 
      cert.course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'courseNameAsc':
          return a.course.courseName.localeCompare(b.course.courseName);
        case 'scoreDesc':
          return b.scorePercentage - a.scorePercentage;
        case 'recent':
        default:
          return new Date(b.issuedAt) - new Date(a.issuedAt);
      }
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-3.5rem)] bg-white text-[#1E293B]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-[#E2E8F0] rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-[#3B82F6] rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 font-medium text-lg">Loading your achievements...</p>
        <p className="text-[#64748B] text-sm mt-1">Please wait while we fetch your certificates</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-white text-[#1E293B] min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-7xl mx-auto">
        {/* Header with stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1E293B]">My Certificates</h1>
          <p className="text-[#64748B] mt-1">Showcase your achievements and learning milestones</p>
          
          {certificates.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] rounded-lg p-4">
                <p className="text-[#3B82F6] font-medium text-sm">Total Certificates</p>
                <p className="text-2xl font-bold text-[#1E293B]">{certificates.length}</p>
              </div>
              <div className="bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] rounded-lg p-4">
                <p className="text-[#22C55E] font-medium text-sm">Highest Score</p>
                <p className="text-2xl font-bold text-[#1E293B]">
                  {Math.max(...certificates.map(c => c.scorePercentage))}%
                </p>
              </div>
              <div className="bg-gradient-to-r from-[#FEF2F2] to-[#FEE2E2] rounded-lg p-4">
                <p className="text-[#EF4444] font-medium text-sm">Latest Achievement</p>
                <p className="text-[#1E293B] font-bold truncate">
                  {certificates.sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt))[0]?.course.courseName}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {certificates.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#F8FAFC] p-8 md:p-12 rounded-xl text-center border border-[#E2E8F0] shadow-sm"
          >
            <div className="w-20 h-20 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto mb-6">
              <FaAward className="text-[#94A3B8] text-3xl" />
            </div>
            <h2 className="text-[#334155] text-xl font-bold mb-2">No Certificates Found</h2>
            <p className="text-[#475569] text-lg font-medium">You haven't earned any certificates yet.</p>
            <p className="text-[#64748B] mt-2 max-w-md mx-auto">Complete course exams with a passing score to earn your certificates and showcase your skills!</p>
            
            <div className="mt-8">
              <a 
                href="/dashboard/enrolled-courses" 
                className="inline-flex items-center px-6 py-3 bg-[#3B82F6] text-white font-medium rounded-lg hover:bg-[#2563EB] transition-colors"
              >
                <FaSearch className="mr-2" />
                Find Courses to Complete
              </a>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Search and filter controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <input 
                  type="text"
                  placeholder="Search by course name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              </div>
              
              <div className="flex gap-2">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-[#E2E8F0] bg-white text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                >
                  <option value="recent">Recent First</option>
                  <option value="courseNameAsc">Course Name (A-Z)</option>
                  <option value="scoreDesc">Highest Score</option>
                </select>
                
                <div className="flex rounded-lg overflow-hidden border border-[#E2E8F0]">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-3 ${viewMode === 'grid' ? 'bg-[#F8FAFC] text-[#3B82F6]' : 'bg-white text-[#64748B]'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-3 ${viewMode === 'list' ? 'bg-[#F8FAFC] text-[#3B82F6]' : 'bg-white text-[#64748B]'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {filteredCertificates.length === 0 ? (
              <div className="text-center py-12 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <FaSearch className="mx-auto text-3xl text-[#94A3B8]" />
                <p className="mt-3 text-[#475569] font-medium">No certificates match your search.</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-3 text-[#3B82F6] hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <AnimatePresence>
                {viewMode === 'grid' ? (
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                  >
                    {filteredCertificates.map((certificate, index) => (
                      <motion.div 
                        key={certificate._id} 
                        className="bg-white rounded-xl overflow-hidden flex flex-col border border-[#E2E8F0] shadow hover:shadow-lg transition-all duration-300"
                        variants={itemVariants}
                      >
                        {/* Certificate Preview */}
                        <div className="relative h-48 bg-[#F8FAFC] flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-0">
                            <img 
                              src={certificate.course.thumbnail} 
                              alt="Certificate" 
                              className="w-full h-full object-cover opacity-20"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-b from-[#3B82F650] to-[#F8FAFC]"></div>
                          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
                            <div className="w-16 h-16 bg-[#EFF6FF] rounded-full flex items-center justify-center mb-3 border-2 border-[#93C5FD] shadow-md">
                              <FaAward className="text-[#3B82F6] text-2xl" />
                            </div>
                            <div className="text-center">
                              <h3 className="font-bold text-[#1E293B] text-lg">{certificate.course.courseName}</h3>
                              <p className="text-sm text-[#64748B] mt-1">Certificate of Completion</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Certificate Info */}
                        <div className="flex-grow p-4 bg-white">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-[#1E293B] line-clamp-1 flex-1">{certificate.course.courseName}</h3>
                            <span className="inline-flex items-center px-2 py-1 bg-[#EFF6FF] text-[#3B82F6] text-xs font-medium rounded-md">
                              {certificate.scorePercentage}%
                            </span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center text-[#64748B]">
                              <span className="w-24">Earned on:</span> 
                              <span className="text-[#334155] font-medium">{format(new Date(certificate.issuedAt), 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center text-[#64748B]">
                              <span className="w-24">Certificate ID:</span> 
                              <span className="text-[#334155] font-medium">{certificate._id.substring(0, 8).toUpperCase()}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="px-4 pb-4 pt-3 flex gap-3 border-t border-[#E2E8F0]">
                          <button
                            onClick={() => handleView(certificate._id)}
                            className="flex items-center justify-center flex-1 py-2 bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#3B82F6] rounded-lg text-sm font-medium transition-colors border border-[#E2E8F0]"
                          >
                            <FaEye className="mr-2" /> View
                          </button>
                         
                          <button
                            onClick={() => handleShare(certificate._id)}
                            className="flex items-center justify-center w-10 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] rounded-lg text-sm transition-colors"
                            title="Share Certificate"
                          >
                            <FaShare className="text-[#3B82F6]" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    className="space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                  >
                    {filteredCertificates.map((certificate) => (
                      <motion.div 
                        key={certificate._id} 
                        className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-all"
                        variants={itemVariants}
                      >
                        <div className="flex flex-col md:flex-row">
                          {/* Left: Certificate Icon */}
                          <div className="w-full md:w-48 p-4 bg-[#F8FAFC] flex items-center justify-center">
                            <div className="w-16 h-16 bg-[#EFF6FF] rounded-full flex items-center justify-center border-2 border-[#93C5FD] shadow-md">
                              <FaAward className="text-[#3B82F6] text-2xl" />
                            </div>
                          </div>
                          
                          {/* Middle: Certificate Info */}
                          <div className="flex-grow p-4 border-t md:border-t-0 md:border-l border-[#E2E8F0]">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-bold text-lg text-[#1E293B]">{certificate.course.courseName}</h3>
                              <span className="inline-flex items-center px-2.5 py-1 bg-[#EFF6FF] text-[#3B82F6] text-xs font-medium rounded-md">
                                Score: {certificate.scorePercentage}%
                              </span>
                            </div>
                            <p className="text-[#64748B] text-sm mb-4">Certificate of Completion</p>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-[#64748B]">Issued Date</p>
                                <p className="font-medium text-[#334155]">{format(new Date(certificate.issuedAt), 'MMMM dd, yyyy')}</p>
                              </div>
                              <div>
                                <p className="text-[#64748B]">Certificate ID</p>
                                <p className="font-medium text-[#334155]">{certificate._id.substring(0, 8).toUpperCase()}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Right: Actions */}
                          <div className="flex md:flex-col justify-between p-4 bg-[#F8FAFC] border-t md:border-t-0 md:border-l border-[#E2E8F0] md:min-w-[150px]">
                            <button
                              onClick={() => handleView(certificate._id)}
                              className="flex items-center justify-center px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] rounded-lg text-sm font-medium transition-colors"
                            >
                              <FaEye className="mr-2 text-[#3B82F6]" /> View
                            </button>
                            
                           
                            
                            <button
                              onClick={() => handleShare(certificate._id)}
                              className="flex items-center justify-center px-4 py-2 bg-white hover:bg-[#F1F5F9] text-[#334155] rounded-lg text-sm font-medium transition-colors border border-[#E2E8F0] mt-2 md:mt-3"
                            >
                              <FaShare className="mr-2 text-[#3B82F6]" /> Share
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </>
        )}
      </div>
    </div>
  );
}