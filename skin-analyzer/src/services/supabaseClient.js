// src/services/supabaseClient.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please set up Supabase connection.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// --- Auth helpers ---
export const signUp = async (email, password, name) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      }
    }
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  })
  return { data, error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const updateProfile = async (updates) => {
  const { data, error } = await supabase.auth.updateUser(updates)
  return { data, error }
}

// --- Analysis helpers ---

// --- THIS IS THE CRITICAL CHANGE ---
// This function now accepts and saves the `fullResult` object for the history chart.
export const saveAnalysis = async (userId, resultSummary, fullResult) => {
  const { data, error } = await supabase
    .from('analysis_results')
    .insert([
      {
        user_id: userId,
        result_summary: resultSummary,
        full_result: fullResult, // This line is required for the chart
      }
    ])
  return { data, error }
}

export const getUserAnalyses = async (userId) => {
  const { data, error } = await supabase
    .from('analysis_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

// --- Your new helpers (unchanged) ---
// Products helpers
export const getProducts = async (skinType) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('skin_type', skinType)
    .order('category', { ascending: true })
  return { data, error }
}

// Cart helpers
export const addToCart = async (userId, productId, quantity) => {
  const { data, error } = await supabase
    .from('cart_items')
    .upsert([
      {
        user_id: userId,
        product_id: productId,
        quantity: quantity
      }
    ], { 
      onConflict: 'user_id,product_id',
      ignoreDuplicates: false 
    })
  return { data, error }
}

export const getCartItems = async (userId) => {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      products (
        id,
        name,
        description,
        price,
        image_url,
        category,
        brand
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const updateCartItem = async (itemId, quantity) => {
  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
  return { data, error }
}

export const removeFromCart = async (itemId) => {
  const { data, error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId)
  return { data, error }
}

// Orders helpers
export const createOrder = async (userId, totalAmount, shippingAddress, cartItems) => {
  // Start a transaction-like operation
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([
      {
        user_id: userId,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        status: 'pending'
      }
    ])
    .select()
    .single()

  if (orderError) return { data: null, error: orderError }

  // Insert order items
  const orderItems = cartItems.map(item => ({
    order_id: orderData.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.products.price
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) return { data: null, error: itemsError }

  // Clear cart after successful order
  const { error: clearCartError } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)

  if (clearCartError) return { data: null, error: clearCartError }

  return { data: orderData, error: null }
}

export const getUserOrders = async (userId) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (
          id,
          name,
          image_url,
          brand
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}