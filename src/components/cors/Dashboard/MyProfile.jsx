import { useEffect } from "react";
import { RiEditBoxLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../common/IconBtn";

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile);
  console.log(user);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-8">
      <div className="container mx-auto px-4 py-6 max-w-[1000px]">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#111827] mb-2">
            My Profile
          </h1>
          <p className="text-[#6B7280] text-sm md:text-base max-w-md mx-auto">
            Manage your information, account settings and preferences
          </p>
        </div>

        {/* Profile Header Card */}
        <div className="flex flex-col sm:flex-row items-center justify-between rounded-xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-4 sm:mb-0">
            <div className="relative group">
              <img
                src={user?.image}
                alt={`profile-${user?.firstName}`}
                className="aspect-square w-24 sm:w-[90px] rounded-full object-cover border-2 border-[#E5E7EB]"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-300"></div>
            </div>
            <div className="text-center sm:text-left space-y-2">
              <p className="text-2xl font-semibold text-[#111827] capitalize">
                {user?.firstName + " " + user?.lastName}
              </p>
              <p className="text-sm text-[#6B7280]">{user?.email}</p>
              <div className="flex justify-center sm:justify-start gap-2 items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  {user?.accountType || "Student"}
                </span>
                {user?.additionalDetails?.contactNumber && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                    {user?.additionalDetails?.contactNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
          <IconBtn
            text="Edit Profile"
            onclick={() => navigate("/dashboard/settings")}
            className="w-full sm:w-auto bg-[#422FAF] hover:bg-[#3B27A1] text-white py-2 px-4"
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        {/* About Section */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <p className="text-xl font-semibold text-[#111827] mb-4 sm:mb-0">
              About
            </p>
            <IconBtn
              text="Edit"
              onclick={() => navigate("/dashboard/settings")}
              className="bg-white text-[#422FAF] hover:bg-[#F3F4F6] border border-[#D1D5DB]"
            >
              <RiEditBoxLine />
            </IconBtn>
          </div>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-5">
            <p className={`${
              user?.additionalDetails?.about 
                ? "text-[#111827]" 
                : "text-[#9CA3AF] italic"
              } text-sm md:text-base font-medium leading-relaxed`}
            >
              {user?.additionalDetails?.about ?? "Write something about yourself..."}
            </p>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <p className="text-xl font-semibold text-[#111827] mb-4 sm:mb-0">
              Personal Details
            </p>
            <IconBtn
              text="Edit"
              onclick={() => navigate("/dashboard/settings")}
              className="bg-white text-[#422FAF] hover:bg-[#F3F4F6] border border-[#D1D5DB]"
            >
              <RiEditBoxLine />
            </IconBtn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[700px]">
            <div className="space-y-6">
              <DetailItem 
                label="First Name" 
                value={user?.firstName} 
                icon="👤"
              />
              <DetailItem 
                label="Email" 
                value={user?.email} 
                icon="📧"
              />
              <DetailItem 
                label="Gender" 
                value={user?.additionalDetails?.gender ?? "Not specified"} 
                icon="⚧️"
                isEmpty={!user?.additionalDetails?.gender}
              />
            </div>
            
            <div className="space-y-6">
              <DetailItem 
                label="Last Name" 
                value={user?.lastName} 
                icon="👤"
              />
              <DetailItem 
                label="Phone Number" 
                value={user?.additionalDetails?.contactNumber ?? "Not specified"} 
                icon="📱"
                isEmpty={!user?.additionalDetails?.contactNumber}
              />
              <DetailItem 
                label="Date Of Birth" 
                value={user?.additionalDetails?.dateOfBirth ?? "Not specified"} 
                icon="🎂"
                isEmpty={!user?.additionalDetails?.dateOfBirth}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for detail items
const DetailItem = ({ label, value, icon, isEmpty = false }) => (
  <div className="bg-[#F9FAFB] border border-[#E5E7EB] p-4 rounded-lg transition-all duration-200 hover:border-[#D1D5DB] hover:shadow-sm">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-sm">{icon}</span>
      <p className="text-sm text-[#6B7280]">{label}</p>
    </div>
    <p className={`text-sm font-medium ${isEmpty ? "text-[#9CA3AF] italic" : "text-[#111827]"} capitalize`}>
      {value}
    </p>
  </div>
);