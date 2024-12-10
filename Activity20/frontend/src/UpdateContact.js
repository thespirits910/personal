import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const UpdateContact = ({ contacts, setContacts }) => {
    const [searchName, setSearchName] = useState(""); // Input for search
    const [contactsQuery, setContactsQuery] = useState([]); // Filtered contacts
    const [selectedContact, setSelectedContact] = useState(null); // Contact to be updated
    const [contactName, setContactName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [message, setMessage] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedContact) {
            setContactName(selectedContact.contact_name || "");
            setPhoneNumber(selectedContact.phone_number || "");
            setMessage(selectedContact.message || "");
            setPreview(selectedContact.image_url || null);
        }
    }, [selectedContact]);

    const fetchContacts = async () => {
        if (!searchName.trim()) {
            setError("Please enter a contact name to search.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8081/contact/name?contact_name=${encodeURIComponent(searchName)}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch contacts");
            }

            const data = await response.json();
            setContactsQuery(data);
            setError(null); // Clear errors
        } catch (err) {
            setError(`Error loading contacts: ${err.message}`);
        }
    };

    const selectContact = (contact) => {
        setSelectedContact(contact);
        setContactsQuery([]);
        setSuccess(null);
        setError(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && !file.type.startsWith("image/")) {
            setError("Only image files are allowed.");
            return;
        }
        setImage(file);
        setPreview(URL.createObjectURL(file));
        setError(null);
    };

    const updateContact = async () => {
        if (!selectedContact) {
            setError("No contact selected for update.");
            return;
        }
        if (!contactName.trim()) {
            setError("Contact name cannot be empty.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("contact_name", contactName);
            formData.append("phone_number", phoneNumber);
            formData.append("message", message);
            if (image) formData.append("image", image);

            console.log("FormData being sent:");
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const response = await fetch(
                `http://localhost:8081/contact/${selectedContact.id}`,
                {
                    method: "PUT",
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || "Failed to update contact.");
                return;
            }

            const updatedContact = await response.json();
            setContacts((prevContacts) =>
                prevContacts.map((contact) =>
                    contact.id === updatedContact.id ? updatedContact : contact
                )
            );
            setSuccess("Contact updated successfully.");
            setError(null);
            setSelectedContact(null); // Clear the selected contact
        } catch (err) {
            setError(`Error updating contact: ${err.message}`);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateContact();
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Update Contact</h2>
            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Search Functionality */}
            {!selectedContact && (
                <>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter contact name"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={fetchContacts}>
                            Search
                        </button>
                    </div>
                    <ul className="list-group">
                        {contactsQuery.map((contact) => (
                            <li
                                key={contact.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <strong>{contact.contact_name}</strong> -{" "}
                                    {contact.phone_number}
                                </div>
                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => selectContact(contact)}
                                >
                                    Select
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {/* Update Form */}
            {selectedContact && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Contact Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="text"
                            className="form-control"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Message</label>
                        <textarea
                            className="form-control"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contact Image</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={handleImageChange}
                        />
                        {preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                className="mt-3"
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                }}
                            />
                        )}
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Update Contact
                    </button>
                </form>
            )}
        </div>
    );
};

export default UpdateContact;
