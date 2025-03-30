import React from 'react'
import { sidebarLinks } from '../../../data/dashboard-links'
import ConfirmationModal from '../../common/ConfirmationModal'
import { useDispatch, useSelector } from 'react-redux'
import { VscSignOut, VscSettingsGear } from 'react-icons/vsc'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from "../../../services/operations/authAPI"
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
        <div className='lg:flex lg:flex-col text-[#E0E0E0]'>
            {/* Toggle Button for Small Screens */}
            <button
                className="fixed top-[70px] left-4 z-[60] lg:hidden text-2xl text-[#E0E0E0] bg-[#1A1A1A] p-2 rounded-md "
                onClick={toggleSidebar}
            >
                {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </button>
            <div className={`fixed top-0 mt-16 left-0 h-full w-64 bg-[#1A1A1A] py-10 transition-transform duration-300 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:mt-14 lg:w-auto lg:h-full lg:block z-50 max-sm:pt-16`}>
                
                {/* Navigation Links */}
                <div className='flex flex-col'>
                    {sidebarLinks.map((link) => {
                        // Skip links that don't match the user's account type
                        if (link.type && user?.accountType !== link.type) return null;
                        
                        // Get the icon component
                        const Icon = link.icon;
                        
                        return (
                            <NavLink
                                key={link.id}
                                to={link.path}
                                className={({ isActive }) => 
                                    `flex items-center gap-2 px-8 py-2 text-sm font-medium
                                    ${isActive ? "bg-yellow-800 text-yellow-50" : "text-richblack-300"}
                                    hover:text-yellow-50 transition-all duration-200`
                                }
                            >
                                {Icon && <Icon className="text-lg" />}
                                <span>{link.name}</span>
                            </NavLink>
                        )
                    })}
                </div>
                
                <div className='mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600'></div>
                
                {/* Settings and Logout */}
                <div className='flex flex-col'>
                    {/* Settings Link */}
                    <NavLink
                        to="/dashboard/settings"
                        className={({ isActive }) => 
                            `flex items-center gap-2 px-8 py-2 text-sm font-medium
                            ${isActive ? "bg-yellow-800 text-yellow-50" : "text-richblack-300"}
                            hover:text-yellow-50 transition-all duration-200`
                        }
                    >
                        <VscSettingsGear className="text-lg" />
                        <span>Settings</span>
                    </NavLink>
                    
                    {/* Logout Button */}
                    <button
                        onClick={() => setConfirmationModal({
                            text1: "Are You Sure ?",
                            text2: "You will be logged out of your Account",
                            btn1Text: "Logout",
                            btn2Text: "Cancel",
                            btn1Handler: () => dispatch(logout(navigate)),
                            btn2Handler: () => setConfirmationModal(null),
                        })}
                        className='flex items-center gap-2 px-8 py-2 text-sm font-medium text-richblack-300 hover:text-yellow-50 transition-all duration-200'
                    >
                        <VscSignOut className='text-lg' />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
            
            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </div>
    )
}

export default SlideBar