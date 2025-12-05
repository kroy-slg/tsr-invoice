import React, { useState, useEffect } from "react";
import "../../assets/css/Customers.css";


const Customers = () => {
    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        gstNumber: "",
    });

    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [editIndex, setEditIndex] = useState(null);

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("customers");
        if (stored) setCustomers(JSON.parse(stored));
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("customers", JSON.stringify(customers));
    }, [customers]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editIndex !== null) {
            const updated = [...customers];
            updated[editIndex] = customer;
            setCustomers(updated);
            setEditIndex(null);
        } else {
            setCustomers([...customers, customer]);
        }

        setCustomer({ name: "", email: "", phone: "", address: "", gstNumber: "" });
    };

    const handleEdit = (index) => {
        setCustomer(customers[index]);
        setEditIndex(index);
    };

    const handleDelete = (index) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            setCustomers(customers.filter((_, i) => i !== index));
        }
    };

    // Filter customers by search
    const filteredCustomers = customers.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            c.phone.includes(search)
    );

    return (
        <div className="customers-wrapper">
            {/* Left - Form */}
            <div className="customer-form-section">
                <h1 className="customer-title">
                    {editIndex !== null ? "Edit Customer" : "Add Customer"}
                </h1>

                <form className="customer-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={customer.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={customer.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone:</label>
                        <input
                            type="tel"
                            name="phone"
                            value={customer.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Address:</label>
                        <textarea
                            name="address"
                            value={customer.address}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>GST Number:</label>
                        <input
                            type="text"
                            name="gstNumber"
                            value={customer.gstNumber}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn-submit">
                        {editIndex !== null ? "Update Customer" : "Add Customer"}
                    </button>
                </form>
            </div>

            {/* Right - List */}
            <div className="customer-list-section">
                <div className="list-header">
                    <h2>Customers List</h2>
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                </div>

                {filteredCustomers.length > 0 ? (
                    <table className="customer-table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>GST</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredCustomers.map((c, index) => (
                            <tr key={index}>
                                <td>{c.name}</td>
                                <td>{c.email}</td>
                                <td>{c.phone}</td>
                                <td>{c.gstNumber || "-"}</td>
                                <td>{c.address || "-"}</td>
                                <td className="action-buttons">
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(index)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(index)}
                                    >
                                        🗑
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-data">No customers found.</p>
                )}
            </div>
        </div>
    );
};

export default Customers;
