import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Contacts = ({ contacts, setContacts }) => {
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("http://localhost:8081/contact");
        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }
        const data = await response.json();
        setContacts(data); // Update contacts state with fetched data
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, [setContacts]); // Include setContacts in the dependency array

  if (!contacts || contacts.length === 0) {
    return (
      <div className="container text-center mt-4">
        <h2>Contacts List</h2>
        <p className="text-muted">No contacts available.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="text-center mt-4">Contacts List</h2>
      <ul className="list-group">
        {contacts.map((contact) => (
          <li
            key={contact.id}
            className="list-group-item d-flex align-items-center"
          >
            {contact.image_url && (
              <img
                src={`http://localhost:8081${contact.image_url}`}
                alt={`${contact.contact_name}'s avatar`}
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contacts;
