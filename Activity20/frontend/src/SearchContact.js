import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const SearchContact = ({ contacts, setContacts }) => {
  const [contactName, setContactName] = useState(""); // Input state for search
  const [contactsQuery, setContactsQuery] = useState([]); // Filtered contacts
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch contacts by name or partial name
  const fetchContacts = async () => {
    if (!contactName.trim()) {
      setError("Please enter a contact name");
      setContactsQuery([]);
      return;
    }

    setLoading(true); // Show loader while fetching
    setError(null); // Clear previous errors
    try {
      const response = await fetch(
        `http://localhost:8081/contact/name?contact_name=${encodeURIComponent(
          contactName
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }

      const data = await response.json();
      setContactsQuery(data);
    } catch (err) {
      setError(`Error fetching contacts: ${err.message}`);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4">Search Contact</h2>
      
      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Search Input */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter contact name"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={fetchContacts}>
          Search
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Results */}
      <ul className="list-group">
        {contactsQuery.length > 0 ? (
          contactsQuery.map((contact) => (
            <li
              key={contact.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center">
                {contact.image_url && (
                  <img
                    src={`http://localhost:8081${contact.image_url}`}
                    alt={contact.contact_name}
                    style={{
                      width: "50px",
                      height: "50px",
                      marginRight: "15px",
                      objectFit: "cover",
                    }}
                    className="rounded-circle"
                  />
                )}
                <div>
                  <strong>{contact.contact_name}</strong> - {contact.phone_number}
                  {contact.message && <p className="mb-0">{contact.message}</p>}
                </div>
              </div>
            </li>
          ))
        ) : (
          !loading && (
            <li className="list-group-item text-center text-muted">
              No contacts found.
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default SearchContact;
