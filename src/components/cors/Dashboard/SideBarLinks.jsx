import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { sidebarLinks } from "../../../data/dashboard-links";

export default function SideBarLinks() {
  const { user } = useSelector((state) => state.profile);
  const location = useLocation();
  const [visibleLinks, setVisibleLinks] = useState([]);

  // Process links whenever user changes
  useEffect(() => {
    if (!user) return;
    
    console.log("User account type:", user?.accountType);
    
    // Get unique links for this user type
    const uniqueLinksMap = new Map();
    
    sidebarLinks.forEach(link => {
      // Only include links with no type or matching user type
      if (!link.type || link.type === user.accountType) {
        // Use path as a unique key to avoid any ID issues
        if (!uniqueLinksMap.has(link.path)) {
          uniqueLinksMap.set(link.path, link);
        } else {
          console.warn(`Duplicate sidebar link path detected: ${link.path} - ${link.name}`);
        }
      }
    });
    
    // Convert map to array
    const uniqueLinks = Array.from(uniqueLinksMap.values());
    console.log("Unique links:", uniqueLinks.length);
    
    setVisibleLinks(uniqueLinks);
  }, [user?.accountType]);

  // Debug logging
  useEffect(() => {
    console.log("Visible links:", visibleLinks.map(l => l.name));
    
    // Detect any duplicates by path for debugging
    const paths = visibleLinks.map(l => l.path);
    const duplicatePaths = paths.filter((path, index) => paths.indexOf(path) !== index);
    if (duplicatePaths.length > 0) {
      console.error("Duplicate paths detected:", duplicatePaths);
    }
  }, [visibleLinks]);

  return (
    <div className="flex flex-col gap-2">
      {visibleLinks.map((link, index) => {
        const Icon = link.icon;
        
        return (
          <NavLink
            key={`${link.id}-${index}`} // Use both id and index to ensure uniqueness
            to={link.path}
            className={({ isActive }) => 
              `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md
              ${isActive ? "bg-yellow-800 text-yellow-50" : "text-richblack-300"}
              hover:text-yellow-50 transition-all duration-200`
            }
          >
            {Icon && <Icon className="text-lg" />}
            <span>{link.name}</span>
          </NavLink>
        );
      })}
    </div>
  );
}