import React, { useState } from "react";
import Sidebar from "../layout/Sidebar.jsx";
import TopHeader from "../layout/TopHeader.jsx";
import "../../assets/css/Products.css";

const Products = ({ user, onLogout }) => {
    const [categories, setCategories] = useState({
        Electronics: {
            subcategories: ["Mobile", "Laptop", "Smart Watch"],
            items: ["iPhone 15", "Dell XPS", "Samsung Galaxy Watch"],
        },
        Groceries: {
            subcategories: ["Grains", "Snacks", "Oils"],
            items: ["Rice", "Chips", "Sunflower Oil"],
        },
        Clothing: {
            subcategories: ["Men", "Women", "Kids"],
            items: ["T-Shirt", "Jeans", "Jacket"],
        },
    });

    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [newProduct, setNewProduct] = useState({
        category: "",
        customCategory: "",
        subcategory: "",
        name: "",
        buyPrice: "",
        sellPrice: "",
        stock: "",
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    // Add new category dynamically
    const handleAddCategory = () => {
        const cat = newProduct.customCategory.trim();
        if (!cat) return;
        if (!categories[cat]) {
            setCategories({ ...categories, [cat]: { subcategories: [], items: [] } });
        }
        setNewProduct({ ...newProduct, category: cat, customCategory: "" });
    };

    // Add new product
    const handleAddProduct = (e) => {
        e.preventDefault();
        const { category, subcategory, name, buyPrice, sellPrice, stock } = newProduct;

        if (!category || !name || !buyPrice || !sellPrice || !stock) {
            alert("Please fill all required fields!");
            return;
        }

        const profit = parseFloat(sellPrice) - parseFloat(buyPrice);

        const newEntry = {
            id: Date.now(),
            category,
            subcategory,
            name,
            buyPrice: parseFloat(buyPrice),
            sellPrice: parseFloat(sellPrice),
            stock: parseInt(stock),
            profit,
        };

        setProducts([...products, newEntry]);
        setNewProduct({
            category: "",
            customCategory: "",
            subcategory: "",
            name: "",
            buyPrice: "",
            sellPrice: "",
            stock: "",
        });
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const profitPreview =
        newProduct.buyPrice && newProduct.sellPrice
            ? newProduct.sellPrice - newProduct.buyPrice
            : "";

    // const selectedCategory = categories[newProduct.category];

    return (
        <div className="products-container">
            <Sidebar onLogout={onLogout} />
            <main className="products-main">
                <TopHeader user={user} />

                <div className="products-content">
                    <h1 className="products-title">Add Products</h1>

                    <form className="product-form" onSubmit={handleAddProduct}>
                        {/* Category Row */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Category *</label>
                                <select
                                    name="category"
                                    value={newProduct.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {Object.keys(categories).map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Add new category */}
                            <div className="form-group">
                                <label>Or Add New Category</label>
                                <div className="inline-field">
                                    <input
                                        type="text"
                                        name="customCategory"
                                        value={newProduct.customCategory}
                                        placeholder="Enter new category"
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="add-cat-btn"
                                        onClick={handleAddCategory}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Subcategory Row */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Sub Category</label>
                                <input
                                    type="text"
                                    name="subcategory"
                                    value={newProduct.subcategory}
                                    onChange={handleChange}
                                    placeholder="Enter subcategory (optional)"
                                />
                            </div>
                        </div>

                        {/* Product Name Row */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newProduct.name}
                                    onChange={handleChange}
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Price & Stock */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Buying Price (₹)*</label>
                                <input
                                    type="number"
                                    name="buyPrice"
                                    value={newProduct.buyPrice}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Selling Price (₹)*</label>
                                <input
                                    type="number"
                                    name="sellPrice"
                                    value={newProduct.sellPrice}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Profit (₹)</label>
                                <input type="number" value={profitPreview} readOnly />
                            </div>

                            <div className="form-group">
                                <label>Stock Available *</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={newProduct.stock}
                                    onChange={handleChange}
                                    placeholder="Available stock"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="add-btn">
                            Add Product
                        </button>
                    </form>

                    {/* Products Table */}
                    <div className="product-list">
                        <div className="product-list-header">
                            <h2>Products List</h2>
                            <input
                                type="text"
                                placeholder="Search product..."
                                className="search-bar"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {filteredProducts.length === 0 ? (
                            <p className="no-products">No products found.</p>
                        ) : (
                            <table className="product-table">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Subcategory</th>
                                    <th>Buying (₹)</th>
                                    <th>Selling (₹)</th>
                                    <th>Profit (₹)</th>
                                    <th>Stock</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>{product.category}</td>
                                        <td>{product.subcategory}</td>
                                        <td>{product.buyPrice}</td>
                                        <td>{product.sellPrice}</td>
                                        <td className={product.profit >= 0 ? "profit" : "loss"}>
                                            {product.profit}
                                        </td>
                                        <td>
                        <span
                            className={
                                product.stock < 10 ? "low-stock" : "in-stock"
                            }
                        >
                          {product.stock}
                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Products;
