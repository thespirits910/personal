import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ username, userRole }) => {
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (!username) {
      console.warn("Username not provided. Skipping profile picture fetch.");
      return;
    }

    async function fetchProfilePicture() {
      console.log("Fetching profile picture for Sidebar...");
      try {
        const response = await fetch(
          `http://localhost:8081/contact/profile_picture/${encodeURIComponent(
            username
          )}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Profile picture data:", data);
          setProfilePicture(`http://localhost:8081${data.picture}`);
        } else {
          console.error(
            `Failed to fetch profile picture. Status: ${response.status} - ${response.statusText}`
          );
        }
      } catch (err) {
        console.error("Error fetching profile picture:", err);
      }
    }

    fetchProfilePicture();
  }, [username]);

  return (
    <div
      className="d-flex flex-column vh-100 p-3 bg-light"
      style={{ width: "250px" }}
    >
      <h2 className="text-center mb-4">Navigation</h2>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? "text-primary" : "text-dark"}`
            }
          >
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/contacts"
            className={({ isActive }) =>
              `nav-link ${isActive ? "text-primary" : "text-dark"}`
            }
          >
            View Contacts
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/search-contacts"
            className={({ isActive }) =>
              `nav-link ${isActive ? "text-primary" : "text-dark"}`
            }
          >
            Search Contact
          </NavLink>
        </li>
        {userRole === "admin" && (
          <>
            <li className="nav-item">
              <NavLink
                to="/add-contact"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "text-primary" : "text-dark"}`
                }
              >
                Add Contact
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/delete-contact"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "text-primary" : "text-dark"}`
                }
              >
                Delete Contact
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/update-contact"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "text-primary" : "text-dark"}`
                }
              >
                Update Contact
              </NavLink>
            </li>
          </>
        )}
        <li className="nav-item">
          <NavLink
            to="/new_message"
            className={({ isActive }) =>
              `nav-link ${isActive ? "text-primary" : "text-dark"}`
            }
          >
            Add New Message
          </NavLink>
        </li>
      </ul>

      {/* Profile Picture Section */}
      <div className="profile-picture text-center mt-4">
        {profilePicture ? (
          <img
            src={profilePicture}
            alt="User Profile"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "10px",
            }}
          />
        ) : (
          <p>No Profile Picture</p>
        )}
        <p className="mt-2">
          <strong>{username || "Guest"}</strong>
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
