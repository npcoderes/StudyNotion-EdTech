import React from 'react'
import SideBarLinks from './SideBarLinks'
import { sidebarLinks } from '../../../data/dashboard-links'
import ConfirmationModal from '../../common/ConfirmationModal'
import { useDispatch, useSelector } from 'react-redux'
import { VscSignOut } from 'react-icons/vsc'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from "../../../services/operations/authAPI"
import { Link } from 'react-router-dom'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'

const SlideBar = () => {
    const { user } = useSelector((state) => state.profile)
    const [confirmationModal, setConfirmationModal] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div  className=' lg:flex lg:flex-col text-[#E0E0E0]'>
            {/* Toggle Button for Small Screens */}
            {/* Toggle button for sidebar */}
            <button
                className="fixed top-[70px] left-4 z-[60] lg:hidden text-2xl text-[#E0E0E0] bg-[#1A1A1A] p-2 rounded-md "
                onClick={toggleSidebar}
            >
                {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </button>
            <div className={`fixed top-0 mt-16 left-0 h-full w-64 bg-[#1A1A1A] py-10 transition-transform duration-300 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:mt-14 lg:w-auto lg:h-full lg:block z-50 max-sm:pt-16`}>
                <div className='flex flex-col'>
                    {

                        sidebarLinks.map((link) => {
                            if (link.type && user?.accountType !== link.type) return null;
                            return (
                                <SideBarLinks key={link.id} link={link} iconName={link.icon} />
                            )
                        })}
                </div>
                <div className='mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600'></div>
                <div className='flex flex-col'>
                    <SideBarLinks
                        link={{ name: "Settings", path: "dashboard/settings" }}
                        iconName="VscSettingsGear"
                    />
                    <button
                        onClick={() => setConfirmationModal({
                            text1: "Are You Sure ?",
                            text2: "You will be logged out of your Account",
                            btn1Text: "Logout",
                            btn2Text: "Cancel",
                            btn1Handler: () => dispatch(logout(navigate)),
                            btn2Handler: () => setConfirmationModal(null),
                        })}
                        className='text-sm font-medium text-richblack-300'>
                        <div className='flex items-center gap-x-2 px-8 py-2'>
                            <VscSignOut className='text-lg' />
                            <span>Logout</span>
                        </div>
                    </button>


    
                  
                </div>

            </div>
            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </div>
    )
}

export default SlideBar