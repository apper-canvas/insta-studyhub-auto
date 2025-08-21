import React, { useState, useContext } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from "@/App";
const Header = ({ onMenuClick }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const authContext = useContext(AuthContext);

  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <header className="bg-surface-50 border-b border-surface-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bold font-display text-surface-900">
              Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}!
            </h1>
            <p className="text-sm text-surface-600 mt-1">
              {formatDate(currentTime)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200">
            <ApperIcon name="Clock" className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">
              {formatTime(currentTime)}
            </span>
          </div>
          
<Button variant="ghost" size="sm" className="relative">
            <ApperIcon name="Bell" className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent-500 rounded-full"></span>
          </Button>
          
<Button variant="ghost" size="sm" onClick={() => {
            authContext?.logout();
          }}>
            <ApperIcon name="LogOut" className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;