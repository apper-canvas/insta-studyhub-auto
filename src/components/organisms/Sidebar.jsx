import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen = true, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Courses", href: "/courses", icon: "BookOpen" },
    { name: "Assignments", href: "/assignments", icon: "FileText" },
    { name: "Calendar", href: "/calendar", icon: "Calendar" },
    { name: "Grades", href: "/grades", icon: "TrendingUp" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-surface-50 border-r border-surface-200 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 py-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                StudyHub
              </span>
            </div>
          </div>
          
          <nav className="flex-1 px-4 pb-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 border border-primary-200"
                      : "text-surface-700 hover:bg-surface-100 hover:text-surface-900"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon
                      name={item.icon}
                      className={cn(
                        "mr-3 flex-shrink-0 h-5 w-5",
                        isActive ? "text-primary-600" : "text-surface-400 group-hover:text-surface-600"
                      )}
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={cn(
        "fixed inset-0 flex z-40 lg:hidden transition-opacity duration-300",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <div className="fixed inset-0 bg-surface-900 bg-opacity-75" onClick={onClose} />
        
        <div className={cn(
          "relative flex-1 flex flex-col max-w-xs w-full bg-surface-50 transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={onClose}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <ApperIcon name="X" className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex items-center flex-shrink-0 px-6 py-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                StudyHub
              </span>
            </div>
          </div>
          
          <nav className="flex-1 px-4 pb-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 border border-primary-200"
                      : "text-surface-700 hover:bg-surface-100 hover:text-surface-900"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon
                      name={item.icon}
                      className={cn(
                        "mr-3 flex-shrink-0 h-5 w-5",
                        isActive ? "text-primary-600" : "text-surface-400 group-hover:text-surface-600"
                      )}
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;