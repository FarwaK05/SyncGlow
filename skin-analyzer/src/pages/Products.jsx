 // src/pages/Products.jsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts, addToCart, getCartItems } from '../services/supabaseClient'
import Card from '../components/Card'
import Button from '../components/Button'

// --- ICON CHANGES START HERE ---
// We are no longer importing from 'react-icons'.
// Instead, we define our own simple SVG icon components.

const IconLeaf = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20h18L12 4 3 20z"/><path d="M12 4v16"/></svg>
);
const IconFeather = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><path d="m16 8-4 4"/></svg>
);
const IconDroplet = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
);
const IconMoon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);
const IconLayers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
);
const IconShield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

const Products = ({ user }) => {
  const [selectedSkinType, setSelectedSkinType] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [addingToCart, setAddingToCart] = useState({})
  const navigate = useNavigate();

  const skinTypes = [
    {
      id: 'normal',
      name: 'Normal Skin',
      description: 'Balanced skin with minimal concerns',
      color: 'bg-gradient-to-br from-green-100 to-green-200',
      icon: <IconLeaf />
    },
    {
      id: 'sensitive',
      name: 'Sensitive Skin',
      description: 'Easily irritated, requires gentle care',
      color: 'bg-gradient-to-br from-pink-100 to-pink-200',
      icon: <IconFeather />
    },
    {
      id: 'oily',
      name: 'Oily Skin',
      description: 'Excess oil production, enlarged pores',
      color: 'bg-gradient-to-br from-blue-100 to-blue-200',
      icon: <IconDroplet />
    },
    {
      id: 'dry',
      name: 'Dry Skin',
      description: 'Lacks moisture, may feel tight',
      color: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
      icon: <IconMoon />
    },
    {
      id: 'combination',
      name: 'Combination Skin',
      description: 'Mix of oily T-zone and normal/dry cheeks',
      color: 'bg-gradient-to-br from-purple-100 to-purple-200',
      icon: <IconLayers />
    },
    {
      id: 'acne',
      name: 'Acne-Prone Skin',
      description: 'Prone to breakouts and blemishes',
      color: 'bg-gradient-to-br from-red-100 to-red-200',
      icon: <IconShield />
    }
  ]
  // --- ICON CHANGES END HERE ---

  useEffect(() => {
    if (user) {
      loadCartItems()
    }
  }, [user])

  useEffect(() => {
    if (selectedSkinType) {
      loadProducts()
    }
  }, [selectedSkinType])

  const loadCartItems = async () => {
    if (!user) return
    const { data, error } = await getCartItems(user.id)
    if (!error && data) {
      setCartItems(data)
    }
  }

  const loadProducts = async () => {
    setLoading(true)
    const { data, error } = await getProducts(selectedSkinType)
    if (!error && data) {
      setProducts(data)
    }
    setLoading(false)
  }

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert('Please login to add items to cart')
      return
    }

    setAddingToCart(prev => ({ ...prev, [productId]: true }))
    const { error } = await addToCart(user.id, productId, 1)
    if (error) {
      alert('Failed to add item to cart')
    } else {
      await loadCartItems()
    }
    setAddingToCart(prev => ({ ...prev, [productId]: false }))
  }

  const isInCart = (productId) => {
    return cartItems.some(item => item.product_id === productId)
  }

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  if (!selectedSkinType) {
    return (
      <div className="min-h-screen bg-gradient-secondary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Skincare Products
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your skin type to discover products specially curated for your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skinTypes.map((skinType) => (
              <Card
                key={skinType.id}
                className={`${skinType.color} border-2 border-transparent`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-4 text-gray-800 inline-block scale-150">
                    {skinType.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 pt-4">
                    {skinType.name}
                  </h3>
                  <p className="text-gray-700 mb-6">
                    {skinType.description}
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => setSelectedSkinType(skinType.id)}
                  >
                    View Products
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {user && getCartItemCount() > 0 && (
            <div className="fixed bottom-6 right-6">
              <Button
                onClick={() => navigate('/cart')}
                className="rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
              >
                🛒 {getCartItemCount()}
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // The rest of the component remains the same
  const selectedSkinTypeInfo = skinTypes.find(st => st.id === selectedSkinType)

  return (
    <div className="min-h-screen bg-gradient-secondary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="outline"
              onClick={() => setSelectedSkinType(null)}
              className="mb-4"
            >
              ← Back to Skin Types
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedSkinTypeInfo?.name} Products
            </h1>
            <p className="text-gray-600">
              {selectedSkinTypeInfo?.description}
            </p>
          </div>
          {user && getCartItemCount() > 0 && (
            <Button
              onClick={() => navigate('/cart')}
              variant="outline"
              className="flex items-center"
            >
              🛒 Cart ({getCartItemCount()})
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cool-gray mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-xl transition-shadow">
                <div className="aspect-w-1 aspect-h-1 mb-4">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <span className="text-xl font-bold text-cool-gray">
                      ${product.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="bg-pale-purple text-cool-gray px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                    <span className="text-gray-500">
                      {product.brand}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleAddToCart(product.id)}
                    loading={addingToCart[product.id]}
                    disabled={isInCart(product.id)}
                    className="w-full"
                    variant={isInCart(product.id) ? 'secondary' : 'primary'}
                  >
                    {isInCart(product.id) ? 'In Cart ✓' : 'Add to Cart'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products found for this skin type.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products