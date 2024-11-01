import { useEffect } from "react";
import { RiEditBoxLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
export default function MyProfile() {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="">
<h1 className="mb-14 text-4xl text-center sm:text-left text-transparent bg-clip-text bg-gradient-to-r from-[#422faf] to-[#422faf] font-inter flex justify-center border-b-2 font-bold">
  My Profile
</h1>



      <div className="flex items-center justify-between rounded-2xl border-[1px] border-[#2C2C2C] bg-[#F5F5FC] p-8 px-3 sm:px-12">
        <div className="flex items-center gap-x-4">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[78px] rounded-full object-cover"
          />
          <div className="space-y-1">
            <p className="text-lg font-semibold text-richblack-800 capitalize">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-sm text-richblack-300">{user?.email}</p>
          </div>
        </div>
        <IconBtn
          text="Edit"
          onclick={() => {
            navigate("/dashboard/settings");
          }}
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>
      <div className="my-10 flex flex-col gap-y-10 rounded-2xl border-[1px] border-[#2C2C2C] bg-[#F5F5FC] p-8 px-7 sm:px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-800">About</p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings");
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p
          className={`${
            user?.additionalDetails?.about
              ? "text-richblack-800"
              : "text-richblack-800"
          } text-sm font-medium`}
        >
          {user?.additionalDetails?.about ?? "Write Something About Yourself"}
        </p>
      </div>
      <div className="my-10 flex flex-col gap-y-10 rounded-2xl border-[1px] border-[#2C2C2C] bg-[#F5F5FC] p-8 px-7 sm:px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-800">
            Personal Details
          </p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings");
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <div className="flex max-w-[500px] justify-between ">
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-600">First Name</p>
              <p className="text-sm font-semibold text-richblack-800 capitalize">
                {user?.firstName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Account Type</p>
              <p className="text-sm font-semibold text-richblack-800 capitalize">
                {user?.accountType}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Email</p>
              <p className="text-sm font-semibold text-richblack-800">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Gender</p>
              <p className="text-sm font-semibold text-richblack-800">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-600">Last Name</p>
              <p className="text-sm font-semibold text-richblack-800 capitalize">
                {user?.lastName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Phone Number</p>
              <p className="text-sm font-semibold text-richblack-800">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Date Of Birth</p>
              <p className="text-sm font-semibold text-richblack-800">
                {user?.additionalDetails?.dateOfBirth ?? "Add Date Of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
