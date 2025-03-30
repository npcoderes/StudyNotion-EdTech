import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { verifyCertificate } from '../../../services/operations/certificateAPI';
import { FaCheckCircle, FaDownload, FaShare, FaRegFilePdf } from 'react-icons/fa';
import { BiArrowBack } from 'react-icons/bi';
import { IoMdRibbon } from 'react-icons/io';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import DarkLogo from '../../../assets/Logo/Logo-Full-Dark.png';

// MongoDB ObjectID validation
const isValidObjectId = (id) => {
  return id && /^[0-9a-fA-F]{24}$/.test(id);
};

export default function CertificateView() {
  const { certificateId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const getCertificateDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!certificateId || !isValidObjectId(certificateId)) {
          setError("Invalid certificate ID format");
          setLoading(false);
          return;
        }
        
        const response = await verifyCertificate(certificateId);
        
        if (response.success) {
          setCertificate(response.data);
        } else {
          setError(response.message || "Certificate not found");
        }
      } catch (err) {
        console.error("Error fetching certificate:", err);
        setError(err.message || "Failed to verify certificate");
      } finally {
        setLoading(false);
      }
    };

    getCertificateDetails();
  }, [certificateId]);

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/certificate/verify/${certificateId}`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'Course Certificate',
          text: 'Check out this course completion certificate!',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Certificate link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing certificate:", error);
      toast.error("Could not share certificate");
    }
  };
  
  const handleDownload = async () => {
    try {
      setDownloading(true);
      toast.loading("Preparing certificate for download...");

      const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1/";
      const downloadUrl = `${baseUrl}/certificates/download/${certificateId}`;
      
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      if (!blob || blob.size < 100) {
        throw new Error("Received empty PDF document");
      }
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${certificate.courseName.replace(/\s+/g, '_')}_Certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.dismiss();
      toast.success("Certificate downloaded successfully");
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading certificate:", error);
      toast.error(error.message || "Failed to download certificate");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mb-2"></div>
        <p className="text-gray-700 font-medium">Loading certificate...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-white to-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Certificate Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            to="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block font-medium transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-white to-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M9 16h6" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Certificate Not Found</h2>
          <p className="text-gray-600 mb-6">The certificate you're looking for could not be found.</p>
          <Link 
            to="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block font-medium transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <Link 
            to="/dashboard/my-certificates"
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-lg shadow-sm transition font-medium border border-gray-100"
          >
            <BiArrowBack size={18} /> Back to Certificates
          </Link>
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-lg shadow-sm transition font-medium border border-gray-100"
            >
              <FaShare size={16} /> Share
            </button>
            <button 
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow-sm transition font-medium disabled:opacity-70"
            >
              {downloading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <FaDownload size={16} /> Download PDF
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Certificate Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={DarkLogo} alt="StudyNotion" className="h-9" />
              <div className="h-8 w-px bg-blue-400/50"></div>
              <h2 className="text-lg font-bold text-white">Course Certificate</h2>
            </div>
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full font-medium">
              <FaCheckCircle size={14} />
              <span>Verified</span>
            </div>
          </div>

          {/* Certificate Content */}
          <div className="p-6 sm:p-10 flex flex-col items-center">
            {/* Premium Certificate Design */}
            <div className="w-full max-w-3xl rounded-xl p-8 bg-white mb-8 shadow-md relative border-8 border-double border-gray-100">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-blue-600 rounded-tl-lg"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-blue-600 rounded-br-lg"></div>
              <div className="absolute top-0 right-0 text-blue-100">
                <IoMdRibbon size={60} />
              </div>
              <div className="absolute bottom-0 left-0 text-blue-100">
                <IoMdRibbon size={60} style={{ transform: 'rotate(180deg)' }} />
              </div>
              
              <div className="text-center border-b border-gray-200 pb-8 mb-8 relative">
                <div className="uppercase tracking-wider text-xs text-blue-600 font-semibold mb-2">StudyNotion</div>
                <h1 className="text-blue-700 font-bold text-4xl mb-3">Certificate of Completion</h1>
                
                <div className="text-gray-500 mt-6">This certifies that</div>
                <div className="text-3xl font-bold text-gray-800 my-4 px-8">{certificate.userName}</div>
                <div className="text-gray-500">has successfully completed the course</div>
                <div className="text-2xl font-bold text-gray-800 mt-4 px-8">{certificate.courseName}</div>
                
                <div className="flex justify-center items-center mt-6">
                  <div className="bg-blue-50 border-2 border-blue-100 rounded-full w-20 h-20 flex items-center justify-center">
                    <span className="text-blue-700 font-bold text-xl">{certificate.scorePercentage}%</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6">
                <div className="text-center sm:text-left">
                  <div className="text-sm text-gray-500 mb-1">Date Issued</div>
                  <div className="text-gray-800 font-medium">{format(new Date(certificate.issuedAt), 'MMMM dd, yyyy')}</div>
                </div>
                
                <div className="px-5 py-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                  <div className="text-sm text-gray-500 mb-1">Certificate ID</div>
                  <div className="text-gray-800 font-mono font-medium">{certificate._id.substring(0, 8).toUpperCase()}</div>
                </div>
                
                <div className="text-center sm:text-right">
                  <div className="text-sm text-gray-500 mb-1">Instructor</div>
                  <div className="text-gray-800 font-medium">{certificate.instructorName}</div>
                  <div className="w-32 h-0.5 bg-gray-300 mt-2 mx-auto sm:ml-auto sm:mr-0"></div>
                </div>
              </div>
              
              {/* Verification info */}
              <div className="text-center mt-8 text-xs text-gray-400 pt-2 border-t border-gray-100">
                Verify this certificate at: <span className="text-blue-500">studynotion.com/verify/{certificate._id}</span>
              </div>
            </div>

            {/* Certificate Details Card */}
            <div className="w-full">
              <div className="flex items-center mb-5">
                <h3 className="text-lg font-semibold text-gray-800">Certificate Details</h3>
                <div className="h-px bg-gray-200 flex-grow ml-4"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <div className="flex gap-3 items-center mb-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Student</div>
                      <div className="text-gray-800 font-semibold">{certificate.userName}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-center">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Course</div>
                      <div className="text-gray-800 font-semibold">{certificate.courseName}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <div className="flex gap-3 items-center mb-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Issued On</div>
                      <div className="text-gray-800 font-semibold">{format(new Date(certificate.issuedAt), 'MMMM dd, yyyy')}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-center">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Instructor</div>
                      <div className="text-gray-800 font-semibold">{certificate.instructorName}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <div className="flex gap-3 items-center">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Score</div>
                      <div className="flex items-center mt-1">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${certificate.scorePercentage}%` }}></div>
                        <span className="ml-3 text-blue-700 font-semibold">{certificate.scorePercentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <div className="flex gap-3 items-center">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <FaRegFilePdf className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-sm text-gray-500">Certificate ID</div>
                      <div className="text-gray-800 font-mono text-sm overflow-hidden text-ellipsis">{certificate._id}</div>
                    </div>
                    <button 
                      onClick={handleDownload}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors"
                    >
                      <FaDownload size={14} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Footer note */}
              <div className="text-center mt-10 text-sm text-gray-500">
                <p>This certificate verifies the completion of the course on StudyNotion's platform.</p>
                <p className="mt-1">© StudyNotion {new Date().getFullYear()}. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}