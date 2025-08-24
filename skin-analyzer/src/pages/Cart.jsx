import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCartItems, updateCartItem, removeFromCart, createOrder } from '../services/supabaseClient'
import Card from '../components/Card'
import Button from '../components/Button'

// A reusable input component for the form
const FormInput = ({ id, label, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={id}
      {...props}
      className="w-full px-3 py-2 border border-thistle rounded-lg focus:outline-none focus:ring-2 focus:ring-cool-gray focus:border-transparent bg-white"
    />
  </div>
);


const Cart = ({ user }) => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState({})
  const [orderLoading, setOrderLoading] = useState(false)
  
  // State for the structured shipping form
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    addressLine1: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      loadCartItems()
    } else {
      navigate('/login')
    }
  }, [user, navigate])

  const loadCartItems = async () => {
    setLoading(true)
    const { data, error } = await getCartItems(user.id)
    if (!error && data) {
      setCartItems(data)
    }
    setLoading(false)
  }

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return

    setUpdating(prev => ({ ...prev, [itemId]: true }))
    
    const { error } = await updateCartItem(itemId, newQuantity)
    
    if (!error) {
      await loadCartItems()
    }
    
    setUpdating(prev => ({ ...prev, [itemId]: false }))
  }

  const handleRemoveItem = async (itemId) => {
    setUpdating(prev => ({ ...prev, [itemId]: true }))
    
    const { error } = await removeFromCart(itemId)
    
    if (!error) {
      await loadCartItems()
    }
    
    setUpdating(prev => ({ ...prev, [itemId]: false }))
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.products.price) * item.quantity)
    }, 0).toFixed(2)
  }
  
  // Handler for form input changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
        ...prev,
        [name]: value
    }));
  };


  const handlePlaceOrder = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const { fullName, addressLine1, city, state, zipCode } = shippingDetails;
    if (!fullName.trim() || !addressLine1.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
      alert('Please fill out all required shipping fields.');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }

    setOrderLoading(true)
    
    // Format the structured address into a single string for the backend
    const formattedAddress = `${fullName}\n${addressLine1}\n${city}, ${state} ${zipCode}`;
    
    const { data, error } = await createOrder(user.id, calculateTotal(), formattedAddress, cartItems)
    
    if (error) {
      alert('Failed to place order. Please try again.')
    } else {
      alert('Order placed successfully!')
      navigate('/orders')
    }
    
    setOrderLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-secondary py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cool-gray mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-secondary py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Discover our amazing skincare products and add them to your cart
            </p>
            <Button onClick={() => navigate('/products')}>
              Start Shopping
            </Button>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="w-20 h-20 object-contain rounded-lg" // Changed to object-contain
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.products.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {item.products.brand} • {item.products.category}
                      </p>
                      <p className="text-cool-gray font-semibold">
                        ${item.products.price}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={updating[item.id] || item.quantity <= 1}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updating[item.id]}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={updating[item.id]}
                      className="text-red-500 hover:text-red-700 p-2 disabled:opacity-50"
                    >
                      🗑️
                    </button>
                  </div>
                </Card>
              ))}
            </div>

            <div>
              <Card className="sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>
                
                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate pr-2" title={item.products.name}>
                        {item.products.name} × {item.quantity}
                      </span>
                      <span className="font-semibold flex-shrink-0">
                        ${(parseFloat(item.products.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-cool-gray">${calculateTotal()}</span>
                  </div>
                </div>

                {/* --- UPDATED SHIPPING FORM --- */}
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Shipping Details
                  </h3>
                  <FormInput
                    id="fullName"
                    name="fullName"
                    label="Full Name"
                    type="text"
                    placeholder="Jane Doe"
                    value={shippingDetails.fullName}
                    onChange={handleShippingChange}
                    required
                  />
                  <FormInput
                    id="addressLine1"
                    name="addressLine1"
                    label="Address Line 1"
                    type="text"
                    placeholder="123 Main St"
                    value={shippingDetails.addressLine1}
                    onChange={handleShippingChange}
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      id="city"
                      name="city"
                      label="City"
                      type="text"
                      placeholder="Anytown"
                      value={shippingDetails.city}
                      onChange={handleShippingChange}
                      required
                    />
                    <FormInput
                      id="state"
                      name="state"
                      label="State / Province"
                      type="text"
                      placeholder="CA"
                      value={shippingDetails.state}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  <FormInput
                    id="zipCode"
                    name="zipCode"
                    label="ZIP / Postal Code"
                    type="text"
                    placeholder="90210"
                    value={shippingDetails.zipCode}
                    onChange={handleShippingChange}
                    required
                  />
                  <div className="pt-2">
                    <Button
                      type="submit"
                      loading={orderLoading}
                      className="w-full"
                      size="lg"
                    >
                      Place Order
                    </Button>
                  </div>
                </form>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  Secure checkout • Free shipping on orders over $50
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart