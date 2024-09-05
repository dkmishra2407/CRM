import React, { useState } from "react";
import "./Dashboard.css";
import CustomPieChart from "../Charts/charts";
import CustomPieChart1 from "../Charts/chart2";
import Sidebar from "../SideBar/SideBar";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar when needed (triggered elsewhere)
  };

  return (
    <div className={`dashboard ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> {/* Sidebar toggles itself */}
      <div className={`main-content ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="top-bar">
          <input
            type="text"
            placeholder="Search Customers / Invoice No / Quotation No"
            className="search-bar"
          />
          <div className="search-icon">
            <span className="material-symbols-outlined">search</span>
          </div>
        </div>
        <div className="overview">
          <h2>Business Overview</h2>
          <div className="overview-cards">
            <div className="card">
              <div className="card-heading">
                <h3>Profit & Loss</h3>
                <small>Last 6 Months</small>
              </div>
              <div className="card-detail">
                <p>Rs 15500</p>
              </div>
              <div className="card-graph"><CustomPieChart /></div>
              <div className="know-more">Know More</div>
            </div>
            <div className="card">
              <div className="card-heading">
                <h3>Expenses</h3>
                <small>Last 6 Months</small>
              </div>
              <div className="card-detail">
                <p>Rs 15500</p>
              </div>
              <div className="card-graph"><CustomPieChart1 /></div>
              <div className="know-more">Know More</div>
            </div>
            <div className="card">
              <div className="card-heading">
                <h3>Sales Agents</h3>
                <span className="material-symbols-outlined">notifications</span>
              </div>
              <div className="sales-agents">
                <p>Laxman: Rs 8500</p>
                <p>Sourabh: Rs 8500</p>
                <p>Vikram: Rs 8500</p>
              </div>
            </div>
            <div className="card inventory">
              <div className="card-heading">
                <h3>Inventory</h3>
                <span className="material-symbols-outlined">notifications</span>
              </div>
              <div className="card-details">
                <div className="available-stock">
                  <span className="sub-details-1" style={{ color: "green", marginLeft: "40px" }}>1400</span>
                  <p>Total Available Stocks</p>
                </div>
                <div className="product-categories">
                  <span className="sub-details-1" style={{ color: "green", marginLeft: "40px" }}>12</span>
                  <p>Product Categories</p>
                </div>
                <div className="out-of-stock">
                  <span className="sub-details-1" style={{ color: "red", marginLeft: "40px" }}>5</span>
                  <p>Out of Stocks</p>
                </div>
              </div>
            </div>
            <div className="card delivery">
              <div className="card-heading">
                <h3>Delivery</h3>
                <span className="material-symbols-outlined">notifications</span>
              </div>
              <div className="card-details">
                <div className="orders">
                  <span className="sub-details-1" style={{ color: "green", marginLeft: "19px" }}>5</span>
                  <p>Orders</p>
                </div>
                <div className="delivered">
                  <span className="sub-details-1" style={{ color: "green", marginLeft: "19px" }}>3</span>
                  <p>Delivered</p>
                </div>
                <div className="pending">
                  <span className="sub-details-1" style={{ color: "red", marginLeft: "19px" }}>2</span>
                  <p>Pending</p>
                </div>
              </div>
            </div>
            <div className="card empty">
              <h3>Empty Card</h3>
              <p>Details here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
