import React, { useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Authentication from "./Login"; // Import Authentication for user roles
import NewMessage from "./NewMessages.js";

// Lazy load components for better performance
const Contacts = lazy(() => import("./Contacts.js"));
const AddContact = lazy(() => import("./AddContacts.js"));
const DeleteContact = lazy(() => import("./DeleteContacts.js"));
const SearchContact = lazy(() => import("./SearchContact.js"));
const UpdateContact = lazy(() => import("./UpdateContact.js")); // Lazy load UpdateContact

function App() {
  const [username, setUsername] = useState(""); // Default empty for login
  const [password, setPassword] = useState(""); // Default empty for login
  const [userRole, setUserRole] = useState(null); // Default is null to force login
  const [contacts, setContacts] = useState([]); // Centralized state for contacts

  return (
    <Router>
      <div className="App">
        {userRole ? (
          <div className="d-flex">
            <Sidebar username={username} userRole={userRole} />
            <div className="flex-grow-1 p-3">
              <h1 className="text-center mb-4">Phone Contacts App</h1>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route
                    path="/"
                    element={<div>Welcome to the Contacts App!</div>}
                  />
                  <Route
                    path="/contacts"
                    element={
                      <Contacts contacts={contacts} setContacts={setContacts} />
                    }
                  />
                  <Route
                    path="/search-contacts"
                    element={
                      <SearchContact
                        contacts={contacts}
                        setContacts={setContacts}
                      />
                    }
                  />
                  <Route
                    path="/new_message"
                    element={<NewMessage />}
                  />
                  {userRole === "admin" && (
                    <>
                      <Route
                        path="/add-contact"
                        element={<AddContact setContacts={setContacts} />}
                      />
                      <Route
                        path="/delete-contact"
                        element={
                          <DeleteContact
                            contacts={contacts}
                            setContacts={setContacts}
                          />
                        }
                      />
                      <Route
                        path="/update-contact"
                        element={
                          <UpdateContact
                            contacts={contacts}
                            setContacts={setContacts}
                          />
                        }
                      />
                    </>
                  )}
                  <Route path="*" element={<div>404 - Page Not Found</div>} />
                </Routes>
              </Suspense>
            </div>
          </div>
        ) : (
          <Authentication
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            setUserRole={setUserRole}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
