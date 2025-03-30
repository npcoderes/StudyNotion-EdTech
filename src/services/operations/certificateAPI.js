import { apiConnector } from "../apiconnector";
import { toast } from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1";

const certificateEndpoints = {
  GET_USER_CERTIFICATES: BASE_URL + "/certificates/user",
  DOWNLOAD_CERTIFICATE: BASE_URL + "/certificates/download",
  VERIFY_CERTIFICATE: BASE_URL + "/certificates/verify",
  GENERATE_CERTIFICATE: BASE_URL + "/certificates/generate",
};

export const fetchUserCertificates = async (token) => {
  try {
    const response = await apiConnector(
      "GET",
      certificateEndpoints.GET_USER_CERTIFICATES,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching certificates:", error);
    throw error;
  }
};

export const downloadCertificate = async (certificateId, token) => {
  try {
    console.log("Downloading certificate with ID:", certificateId);
    
    const response = await apiConnector(
      "GET",
      `${certificateEndpoints.DOWNLOAD_CERTIFICATE}/${certificateId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
        responseType: "arraybuffer" // Important! Change from "blob" to "arraybuffer"
      }
    );
    
    if (response.status === 200) {
      console.log("Certificate download successful, received bytes:", response.data.byteLength);
      return response.data;
    } else {
      console.error("Error response from server:", response);
      throw new Error("Failed to download certificate");
    }
  } catch (error) {
    console.error("Error downloading certificate:", error);
    throw error;
  }
};

export const verifyCertificate = async (certificateId) => {
  try {
    console.log("Verifying certificate with ID:", certificateId);
    
    // Check if ID is valid before sending request
    if (!certificateId) {
      throw new Error("Certificate ID is required");
    }
    
    const response = await apiConnector(
      "GET",
      `${certificateEndpoints.VERIFY_CERTIFICATE}/${certificateId}`,
      null
    );
    
    console.log("Certificate verification response:", response);
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Certificate verification failed");
    }
  } catch (error) {
    console.error("Error verifying certificate:", error);
    throw error;
  }
};

export const generateCertificate = async (examResultId, token) => {
  try {
    console.log("Calling generate certificate API with:", { examResultId });
    
    const response = await apiConnector(
      "POST",
      certificateEndpoints.GENERATE_CERTIFICATE,
      { examResultId },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    
    console.log("Generate certificate API response:", response);
    return response.data;
  } catch (error) {
    console.error("Error generating certificate:", error);
    throw error;
  }
};