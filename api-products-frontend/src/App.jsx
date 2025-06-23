import { useEffect, useState } from "react";
import axios from "axios";

const API = 'http://localhost:3000/products';

export default function App(){
  // State for the list of products
  const [products, setProducts] = useState([]);
  // State for the form fields
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    inStock: true
  });
  // State for loading indicator
  const [loading, setLoading] = useState(false);
  // State for error messages
  const [error, setError] = useState('');

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to fetch all products from the API
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API);
      setProducts(res.data); // Update products state with data from API
    } catch (error) {
      setError('Failed to fetch Products'); // Set error message if fetch fails
    }
  };

  // Function to handle adding a new product
  const handleAdd = async () => {
    setLoading(true); // Show loading indicator
    setError(''); // Reset error message

    try {
      // Prepare the product object to send (convert price to number)
      const productToSend = {
        ...form,
        price: Number(form.price),
      };

      // Send POST request to API to add product
      const res = await axios.post(API, productToSend);

      // If product is successfully created, update products list and reset form
      if (res.status === 201 && res.data && res.data._id) {
        setProducts(prev => [...prev, res.data]);
        setForm({
          name: '',
          description: '',
          price: 0,
          category: '',
          inStock: true,
        });
      } else {
        setError('The product was not saved correctly.'); // Set error if response is not as expected
      }
    } catch (error) {
      console.error(error.response?.data || error.message); // Log error details
      setError('Failed to add product'); // Set error message
    }

    setLoading(false); // Hide loading indicator
  };

  // Render the UI
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Product Manager</h1>
      
      {/* Display error message if any */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Display loading indicator */}
      {loading && (
        <div className="mb-4 text-blue-600 font-semibold animate-pulse">Loading...</div>
      )}
      
      {/* Product form */}
      <form onSubmit={e => { e.preventDefault(); handleAdd(); }} className="mb-8 space-y-4">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={e => setForm({ ...form, inStock: e.target.checked })}
              className="w-5 h-5"
            />
            <span>In Stock</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
      
      {/* List of products */}
      <ul className="space-y-2">
        {products.map(product => (
          <li key={product._id} className="p-3 bg-gray-50 rounded-md border border-gray-200">
            <span className="font-medium text-gray-800">{product.name}</span>
            <div className="text-sm text-gray-600">{product.description}</div>
            <div className="text-sm text-gray-500">
              {product.category && <>Category: {product.category} | </>}
              Price: {product.price} | 
              <span className={product.inStock ? "text-green-600" : "text-red-500"}>
                {product.inStock ? " In Stock" : " Out of Stock"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}











