import React from 'react'
import { matchPath, NavLink } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import * as icon from 'react-icons/vsc'
import {IoCartOutline} from 'react-icons/io5'

const SideBarLinks = ({ link, iconName }) => {
    const Icon = iconName===("IoCartOutline") ?(IoCartOutline):(icon[iconName])
    const location = useLocation()
    function matchroute(route) {
        return matchPath({ path: route }, location.pathname)
    }

    return (
        <NavLink to={link.path}
            className={`relative px-8 py-2 text-sm font-medium ${matchroute(link.path) ? "bg-yellow-800" : ("bg-opacity-0")} `}>
            {/* for highlite part which active window  */}
            <span className={`absolute left-0 top-0 h-full w-[0.2rem]
        ${matchroute(link.path) ? " bg-yellow-50" : "opactity-0"}`} />


            <div className='flex items-center gap-x-2'>
                <Icon className="text-lg"></Icon>
                <span>{link.name}</span>
            </div>

        </NavLink>
    )
}

export default SideBarLinks