import { NavLink } from "react-router-dom";

function Sidebar() {
  // A function to dynamically set classes based on whether the link is active
  const activeClass = "bg-red-500 text-white font-semibold";
  const inactiveClass = "text-gray-700 hover:bg-blue-100";

  return (
    <>
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-lg md:block">
        <div className="p-6 text-center border-b">
          <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${isActive ? activeClass : inactiveClass}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/zipcodes"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${isActive ? activeClass : inactiveClass}`
            }
          >
            Manage Zipcodes
          </NavLink>
          <NavLink
            to="/admin/upload"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${isActive ? activeClass : inactiveClass}`
            }
          >
            Upload Zipcode CSV
          </NavLink>
          <NavLink
            to="/admin/bookings"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${isActive ? activeClass : inactiveClass}`
            }
          >
            Manage Bookings
          </NavLink>
          {/* <NavLink
            to="/admin/chat"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${isActive ? activeClass : inactiveClass}`
            }
          >
            Live chat
          </NavLink> */}
          
        </nav>
      </aside>
      
    </>
  );
}

export default Sidebar;
