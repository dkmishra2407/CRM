import React, { useState } from "react";
import CustomPieChart from "../Charts/charts";
import CustomPieChart1 from "../Charts/chart2";
import Sidebar from "../SideBar/SideBar";
import Header from "../Header/Header";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Header className="UniversalHeader" />
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-6">
          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>

          {/* Search Bar */}
          <div className="flex items-center mb-6">
            <input
              type="text"
              placeholder="Search Customers / Invoice No / Quotation No"
              className="border p-2 rounded-lg w-64"
            />
            <span className="ml-2 text-gray-600 material-symbols-outlined">search</span>
          </div>

          {/* Business Overview */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Business Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Profit & Loss Card */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold">Profit & Loss</h3>
                  <small className="text-gray-500">Last 6 Months</small>
                </div>
                <div className="text-2xl font-bold">Rs 15500</div>
                <div className="mt-4">
                  <CustomPieChart />
                </div>
                <div className="mt-4 text-blue-500 cursor-pointer">Know More</div>
              </div>

              {/* Expenses Card */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold">Expenses</h3>
                  <small className="text-gray-500">Last 6 Months</small>
                </div>
                <div className="text-2xl font-bold">Rs 15500</div>
                <div className="mt-4">
                  <CustomPieChart1 />
                </div>
                <div className="mt-4 text-blue-500 cursor-pointer">Know More</div>
              </div>

              {/* Sales Agents Card */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <div className="mb-2 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Sales Agents</h3>
                  <span className="material-symbols-outlined">notifications</span>
                </div>
                <div className="text-lg">
                  <p>Laxman: Rs 8500</p>
                  <p>Sourabh: Rs 8500</p>
                  <p>Vikram: Rs 8500</p>
                </div>
              </div>

              {/* Inventory Card */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <div className="mb-2 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Inventory</h3>
                  <span className="material-symbols-outlined">notifications</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-green-600 font-bold text-lg">1400</p>
                      <p>Total Available Stocks</p>
                    </div>
                    <div>
                      <p className="text-green-600 font-bold text-lg">12</p>
                      <p>Product Categories</p>
                    </div>
                    <div>
                      <p className="text-red-600 font-bold text-lg">5</p>
                      <p>Out of Stocks</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Card */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <div className="mb-2 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Delivery</h3>
                  <span className="material-symbols-outlined">notifications</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-green-600 font-bold text-lg">5</p>
                      <p>Orders</p>
                    </div>
                    <div>
                      <p className="text-green-600 font-bold text-lg">3</p>
                      <p>Delivered</p>
                    </div>
                    <div>
                      <p className="text-red-600 font-bold text-lg">2</p>
                      <p>Pending</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Empty Card */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-semibold">Empty Card</h3>
                <p>Details here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
