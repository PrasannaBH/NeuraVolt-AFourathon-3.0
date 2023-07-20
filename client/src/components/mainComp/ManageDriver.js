import React, { useEffect, useState } from "react";
import MDriverAssign from "../driverCab/MDriverAssign";
import MDriverModal from "../driverCab/MDriverModal";
import MDriverTable from "../driverCab/MDriverTable";
import axios from "axios";
// import "../../css/ManageCab.css";
import "../../css/ManageCab.css"
import Config from "../../Config/Config";

const ManageDriver = () => {
  const [rows, setRows] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [cabs, setCabs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [assignedCabs, setAssignedCabs] = useState({});

  useEffect(() => {
    getDrivers();
    getCabs();
  }, []);

  useEffect(() => {
    fetchAssignedCabs();
  }, [rows]);

  // Fetch drivers from the API
  const getDrivers = async () => {
    try {
      const response = await axios.get(
        `${Config.apiRequest}://${Config.apiHost}:${Config.apiPort}/${Config.apiDriver}`
      );
      console.log(response.data);
      setRows(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch cabs from the API
  const getCabs = async () => {
    try {
      const response = await axios.get(
        `${Config.apiRequest}://${Config.apiHost}:${Config.apiPort}/${Config.apiCab}`
      );
      console.log(response.data);
      setCabs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Get the assigned cab for a driver
  const getAssignedCab = async (driverId) => {
    try {
      const response = await axios.get(
        `${Config.apiRequest}://${Config.apiHost}:${Config.apiPort}/${Config.apiDriver}/${driverId}/${Config.cab}`
      );
      console.log(response.data);
      return response.data || "Not assigned";
    } catch (error) {
      console.error("Error fetching assigned cab:", error);
      return "Not assigned";
    }
  };

  // Fetch assigned cabs for all drivers
  const fetchAssignedCabs = async () => {
    const cabsData = {};
    for (const row of rows) {
      const assignedCab = await getAssignedCab(row.driverIdNumber);
      cabsData[row.driverIdNumber] = assignedCab;
    }
    setAssignedCabs(cabsData);
  };

  // Handle edit button click for a driver
  const handleEditClick = (driverId) => {
    setSelectedDriver(driverId);
    setModalOpen(true);
  };

  // Handle driver update
  const handleDriverUpdate = () => {
    getDrivers();
  };

  // Handle driver delete
  const handleDriverDelete = () => {
    fetchAssignedCabs();
    getDrivers();
  };

  return (
    <div className="ManageCab">
      <div className="form">
        
        <div>
          <h1 className="heading">Manage Drivers</h1>
        </div>
        <div className="gridMCab">
          {cabs.length > 0 && (
            <MDriverAssign
              cabs={cabs}
              onDriverUpdate={handleDriverUpdate}
              getAssignedCab={getAssignedCab}
            />
          )}
          <MDriverTable
            rows={rows}
            onEditClick={handleEditClick}
            assignedCabs={assignedCabs}
            onDriverUpdate={handleDriverUpdate}
          />
        </div>

        {modalOpen && (
          <MDriverModal
            driverId={selectedDriver}
            cabs={cabs}
            onClose={() => setModalOpen(false)}
            onDriverUpdate={handleDriverUpdate}
            onDeleteDriver={handleDriverDelete}
          />
        )}
        <div className="back">
          <button className="btn">Back</button>
        </div>
      </div>
    </div>
  );
};

export default ManageDriver;
