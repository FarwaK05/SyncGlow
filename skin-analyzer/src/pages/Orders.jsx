// src/pages/Orders.jsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' // 1. Import useNavigate
import { getUserOrders } from '../services/supabaseClient'
import Card from '../components/Card'
import Button from '../components/Button'

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const navigate = useNavigate() // 2. Initialize useNavigate

  useEffect(() => {
    if (user) {
      loadOrders()
    } else {
      // If no user, redirect to login page
      navigate('/login')
    }
  }, [user, navigate])

  const loadOrders = async () => {
    setLoading(true)
    const { data, error } = await getUserOrders(user.id)
    if (!error && data) {
      setOrders(data)
    }
    setLoading(false)
  }

  const handleCancelOrder = async (orderId) => {
    // This is a placeholder. In a real app, you'd create a function in supabaseClient.js
    // to update the order status to 'cancelled'.
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      console.log(`Cancelling order: ${orderId}`);
      // Example: const { error } = await cancelOrderInSupabase(orderId);
      // if (!error) { loadOrders(); }
      alert('Order cancellation functionality is not yet implemented.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-secondary py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cool-gray mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-secondary py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track and manage your skincare orders
          </p>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start shopping for amazing skincare products
            </p>
            {/* 3. Use navigate for SPA-friendly routing */}
            <Button onClick={() => navigate('/products')}>
              Start Shopping
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id.slice(0, 8)}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Placed on {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <p className="text-lg font-bold text-cool-gray mt-1">
                      ${order.total_amount}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Items Ordered</h4>
                      <div className="space-y-2">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3">
                            <img
                              src={item.products.image_url}
                              alt={item.products.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {item.products.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                Qty: {item.quantity} × ${item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {order.shipping_address}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 border-t border-gray-200 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                    >
                      {selectedOrder === order.id ? 'Hide Details' : 'View Details'}
                    </Button>
                    {order.status === 'pending' && (
                       // 4. Added onClick handler to the cancel button
                      <Button variant="danger" size="sm" onClick={() => handleCancelOrder(order.id)}>
                        Cancel Order
                      </Button>
                    )}
                  </div>

                  {selectedOrder === order.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Order Timeline</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            Order placed - {formatDate(order.created_at)}
                          </span>
                        </div>
                        {order.status !== 'pending' && (
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">
                              Order confirmed and processing
                            </span>
                          </div>
                        )}
                        {(order.status === 'shipped' || order.status === 'delivered') && (
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">
                              Order shipped
                            </span>
                          </div>
                        )}
                        {order.status === 'delivered' && (
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                            <span className="text-sm text-gray-600">
                              Order delivered
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders