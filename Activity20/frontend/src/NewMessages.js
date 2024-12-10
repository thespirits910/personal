import React, { useState } from "react";

const NewMessage = () => {
  const [contactName, setContactName] = useState("");
  const [contactsQuery, setContactsQuery] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null); // Track which contact is selected
  const [newMessage, setNewMessage] = useState(""); // Track new message input
  const [messages, setMessages] = useState({}); // Store messages by contactId
  const [error, setError] = useState(""); // Error message
  const [loading, setLoading] = useState(false); // Loading state

  const imageStyle = {
    width: "50px",
    height: "50px",
    marginRight: "15px",
    objectFit: "cover",
  };

  // Search contacts by name or partial name
  const fetchContacts = async () => {
    if (!contactName.trim()) {
      setError("Please enter a contact name.");
      return;
    }
    setLoading(true);
    setError(""); // Clear any previous error
    try {
      const response = await fetch(
        `http://localhost:8081/contact/name?contact_name=${encodeURIComponent(
          contactName.trim()
        )}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch contacts: ${errorData.error}`);
      }
      const data = await response.json();
      setContactsQuery(data);
    } catch (err) {
      setError(`Error loading contacts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a contact
  const fetchMessages = async (contactId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8081/contact/messages/${contactId}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch messages: ${errorData.error}`);
      }
      const data = await response.json();
      // Store messages for this contact
      setMessages((prevMessages) => ({ ...prevMessages, [contactId]: data }));
    } catch (err) {
      setError(`Error fetching messages: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add a new message for a contact
  const handleSendMessage = async (contactId) => {
    if (!newMessage.trim()) {
      setError("Please enter a message.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8081/contact/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId, message: newMessage.trim() }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      // Refresh messages after successfully sending
      fetchMessages(contactId);
      setNewMessage(""); // Clear message input
    } catch (err) {
      setError(`Error sending message: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4">Add a New Message</h2>
      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter contact name"
          value={contactName}
          onChange={(e) => setContactName(e.target.value.trimStart())}
        />
        <button
          className="btn btn-primary"
          onClick={fetchContacts}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <ul className="list-group">
        {contactsQuery.map((contact) => (
          <li key={contact.id} className="list-group-item">
            <div className="d-flex align-items-center">
              {/* Contact Image */}
              {contact.image_url && (
                <img
                  src={`http://localhost:8081${contact.image_url}`}
                  alt={contact.contact_name}
                  style={imageStyle}
                />
              )}
              <div>
                <strong>{contact.contact_name}</strong> - {contact.phone_number}
              </div>
              {/* Expand Messages Button */}
              <button
                className="btn btn-sm btn-link ms-2"
                onClick={() => fetchMessages(contact.id)}
                disabled={loading}
              >
                ↕ Show Messages
              </button>
              {/* New Message Button */}
              <button
                className="btn btn-outline-secondary btn-sm ms-auto"
                onClick={() => setSelectedContactId(contact.id)}
                disabled={loading}
              >
                New Message
              </button>
            </div>
            {/* Messages List */}
            {messages[contact.id] && (
              <ul className="list-group mt-2">
                {messages[contact.id].map((msg, index) => (
                  <li key={index} className="list-group-item">
                    {msg.message}{" "}
                    <small className="text-muted">
                      ({msg.message_timestamp})
                    </small>
                  </li>
                ))}
              </ul>
            )}
            {/* Input Form for Adding New Message */}
            {selectedContactId === contact.id && (
              <div className="mt-3">
                <textarea
                  className="form-control mb-2"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="New Message"
                  disabled={loading}
                />
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleSendMessage(contact.id)}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Submit"}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewMessage;
