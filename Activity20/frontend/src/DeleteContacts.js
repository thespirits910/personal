import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DeleteContact = ({ contacts, setContacts }) => {
  const [contactName, setContactName] = useState(""); // Input value for search
  const [contactsQuery, setContactsQuery] = useState([]); // Filtered contacts
  const [error, setError] = useState(null); // Error message
  const [success, setSuccess] = useState(null); // Success message

  // Search contacts by name or partial name
  const fetchContacts = async () => {
    if (!contactName.trim()) {
      setError("Please enter a contact name");
      setSuccess(null);
      return;
    }
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
      setError(null); // Clear errors
      setSuccess(null); // Clear success
    } catch (err) {
      setError(`Error loading contacts: ${err.message}`);
      setSuccess(null);
    }
  };

  // Delete a contact by ID
  const deleteOneContact = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/contact/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }
      setContactsQuery(contactsQuery.filter((contact) => contact.id !== id)); // Update filtered list
      setError(null); // Clear errors
      setSuccess("Contact deleted successfully"); // Show success message
    } catch (err) {
      setError(`Error deleting the contact: ${err.message}`);
      setSuccess(null);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4">Delete Contact</h2>
      {/* Error and Success Messages */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
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
      {/* Contact List */}
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
              {/* Delete Button */}
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => deleteOneContact(contact.id)}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          !error && (
            <li className="list-group-item text-center text-muted">
              No contacts found.
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default DeleteContact;
