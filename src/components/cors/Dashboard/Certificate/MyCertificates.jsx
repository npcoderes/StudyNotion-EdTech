import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchUserCertificates, downloadCertificate } from '../../../../services/operations/certificateAPI';
import { FaDownload, FaEye, FaShare, FaAward } from 'react-icons/fa';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function MyCertificates() {
  const { token } = useSelector((state) => state.auth);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDownload = async (certificateId, courseName) => {
    try {
      toast.loading("Preparing certificate for download...");
      const response = await downloadCertificate(certificateId, token);
      toast.dismiss();
      
      // Create blob from the PDF data
      const blob = new Blob([response], { type: 'application/pdf' });
      
      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${courseName.replace(/\s+/g, '_')}_Certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Certificate downloaded successfully");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-3.5rem)] bg-white text-[#1E293B]">
        <div className="animate-spin h-8 w-8 border-4 border-[#3B82F6] border-t-transparent rounded-full"></div>
        <p className="ml-3 font-medium">Loading certificates...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white text-[#1E293B]">
      <h1 className="text-2xl font-bold mb-6 text-[#1E293B]">My Certificates</h1>
      
      {certificates.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#F8FAFC] p-8 rounded-lg text-center border border-[#E2E8F0] shadow-sm"
        >
          <div className="w-16 h-16 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto mb-4">
            <FaAward className="text-[#94A3B8] text-2xl" />
          </div>
          <p className="text-[#475569] text-lg font-medium">You haven't earned any certificates yet.</p>
          <p className="text-[#64748B] mt-2">Complete course exams to earn certificates!</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate, index) => (
            <motion.div 
              key={certificate._id} 
              className="bg-white rounded-lg overflow-hidden flex flex-col border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <div className="w-16 h-16 bg-[#EFF6FF] rounded-full flex items-center justify-center mb-3 border-2 border-[#93C5FD]">
                    <FaAward className="text-[#3B82F6] text-2xl" />
                  </div>
                  <div className="text-center px-4">
                    <h3 className="font-bold text-[#1E293B]">{certificate.course.courseName}</h3>
                    <p className="text-sm text-[#64748B] mt-1">Certificate of Completion</p>
                  </div>
                </div>
              </div>
              
              {/* Certificate Info */}
              <div className="flex-grow p-4 bg-white">
                <h3 className="font-semibold text-[#1E293B] line-clamp-1">{certificate.course.courseName}</h3>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-[#64748B] text-sm">
                    <span className="w-24">Earned on:</span> 
                    <span className="text-[#334155] font-medium">{format(new Date(certificate.issuedAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center text-[#64748B] text-sm">
                    <span className="w-24">Score:</span> 
                    <span className="text-[#334155] font-medium">{certificate.scorePercentage}%</span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="px-4 pb-4 pt-2 flex gap-2 border-t border-[#E2E8F0]">
                <button
                  onClick={() => handleDownload(certificate._id, certificate.course.courseName)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] p-2 rounded-md text-sm transition-colors font-medium"
                >
                  <FaDownload className="text-[#3B82F6]" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => handleView(certificate._id)}
                  className="flex items-center justify-center w-10 aspect-square bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] rounded-md text-sm transition-colors"
                  title="View Certificate"
                >
                  <FaEye className="text-[#3B82F6]" />
                </button>
                <button
                  onClick={() => handleShare(certificate._id)}
                  className="flex items-center justify-center w-10 aspect-square bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] rounded-md text-sm transition-colors"
                  title="Share Certificate"
                >
                  <FaShare className="text-[#3B82F6]" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}