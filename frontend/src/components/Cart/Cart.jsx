import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import Nav from '../Navbar/Nav';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [showConfirmationCard, setShowConfirmationCard] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isConfirmOrderEnabled, setConfirmOrderEnabled] = useState(false);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const userId = decoded.id;

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`https://bookstoreapp-vftf.onrender.com/order/${userId}/cart`);
        setCartItems(response.data);
        setLoading(false);
        calculateTotalAmount(response.data);
      } catch (err) {
        setError('Failed to load cart');
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  const removeFromCart = async (orderId) => {
    try {
      await axios.delete('https://bookstoreapp-vftf.onrender.com/order/remove-from-cart', { data: { orderId, userId } });
      const updatedCartItems = cartItems.filter((item) => item._id !== orderId);
      setCartItems(updatedCartItems);
      calculateTotalAmount(updatedCartItems);
      toast.success('Removed from the cart');
    } catch (error) {
      console.error('Failed to remove from cart', error);
      toast.error('Failed to remove the item');
    }
  };

  const calculateTotalAmount = (items) => {
    const total = items.reduce((sum, item) => sum + Number(item.productId.price), 0);
    setTotalAmount(total);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setConfirmOrderEnabled(true);
  };

  const placeOrder = () => {
    if (totalAmount === 0) {
      toast.error('Your cart is empty. Please add some items to place an order.');
    } else {
      setShowConfirmationCard(true);
    }
  };

  const confirmOrder = async () => {
    try {
      const response = await axios.post('https://bookstoreapp-vftf.onrender.com/order/place-order', { userId, cartItems });
      toast.success('Order placed successfully!');
      setCartItems([]);
      setTotalAmount(0);
      setShowConfirmationCard(false);
      setPaymentMethod('');
      setConfirmOrderEnabled(false);
    } catch (err) {
      console.error('Failed to place order', err);
      toast.error('Failed to place the order');
    }
  };

  if (loading) return <div>Loading cart...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Nav />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p>Your cart is empty. Start adding items!</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-4 mb-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex flex-col items-center border p-4 shadow-lg w-60">
                  <img
                    src={item.productId.imageUrl || 'Image Loading'}
                    alt={item.productId.name}
                    className="w-full h-40 object-cover mb-4 rounded-md"
                  />
                  <h2 className="text-xl font-semibold">{item.productId.name}</h2>
                  <p className="text-sm text-gray-600">by {item.productId.author}</p>
                  <p className="text-sm text-gray-500">{item.productId.genre}</p>
                  <p className="text-sm text-gray-700 mt-2">{item.productId.discription}</p>
                  <p className="mt-4 font-semibold text-lg">₹{item.productId.price}</p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="mt-4 bg-red-500 text-white py-1 px-4"
                  >
                    Remove from Cart
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <p className="font-bold text-lg">Total: ₹{totalAmount}</p>
              <button
                onClick={placeOrder}
                className="bg-gray-800 text-white py-2 px-4 font-bold"
              >
                Place Order
              </button>
            </div>
          </>
        )}

        {showConfirmationCard && (
          <div className="border p-4 mt-4 shadow-md bg-gray-100">
            <h2 className="text-xl font-bold mb-2">Confirm Your Order</h2>
            <p className="mb-4">Total Amount: ₹{totalAmount}</p>

            <div className="mb-4">
              <label className="block font-medium">
                Payment Method:
              </label>
              <div className="mt-2">
                <input
                  type="radio"
                  id="cashOnDelivery"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  onChange={() => handlePaymentMethodChange('Cash on Delivery')}
                />
                <label htmlFor="cashOnDelivery" className="ml-2">
                  Cash on Delivery
                </label>
              </div>
            </div>

            <button
              onClick={confirmOrder}
              className={`py-2 px-4 font-bold ${isConfirmOrderEnabled ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
              disabled={!isConfirmOrderEnabled}
            >
              Confirm Order
            </button>
          </div>
        )}

        <ToastContainer />
      </div>
    </>
  );
};

export default Cart;
