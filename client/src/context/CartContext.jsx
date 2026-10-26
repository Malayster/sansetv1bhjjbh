import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

/**
 * CartContext Provider.
 * Manages the shopping cart state, including items, sidebar visibility, and totals.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 */
export function CartProvider({ children }) {
    const getCartItemKey = (productId, selectedColor) => `${productId}::${selectedColor || 'default'}`;

    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        if (!savedCart) return [];

        const parsed = JSON.parse(savedCart);
        if (!Array.isArray(parsed)) return [];

        return parsed.map((item) => ({
            ...item,
            cartKey: item.cartKey || getCartItemKey(item.id, item.selectedColor)
        }));
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    /**
     * Adds a product to the cart.
     * @param {Object} product - The product to add.
     */
    const addToCart = (product) => {
        setCartItems((prev) => {
            const rawColor = product.selectedColor || product.secilenRenk || null;
            const selectedColor = rawColor === 'Standard' ? null : rawColor;
            const cartKey = getCartItemKey(product.id, selectedColor);
            const existing = prev.find((item) => item.cartKey === cartKey);

            if (existing) {
                return prev.map((item) =>
                    item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, selectedColor, cartKey, quantity: 1 }];
        });
        setIsSidebarOpen(true);
    };

    /**
     * Removes a product from the cart by cartKey or id.
     * @param {string} identifier - The cartKey or product ID to remove.
     */
    const removeFromCart = (identifier) => {
        if (!identifier) return;
        setCartItems((prev) =>
            prev.filter((item) => {
                const itemKey = item.cartKey || getCartItemKey(item.id, item.selectedColor);
                return itemKey !== identifier && item.id !== identifier;
            })
        );
    };

    /**
     * Updates the quantity of a cart item.
     * Pilihan A: Automatically removes item if new quantity reaches 0 or below.
     * @param {string} identifier - The cartKey or product ID.
     * @param {number} delta - The change in quantity (+1 or -1).
     */
    const updateQuantity = (identifier, delta) => {
        if (!identifier) return;
        setCartItems((prev) =>
            prev.flatMap((item) => {
                const itemKey = item.cartKey || getCartItemKey(item.id, item.selectedColor);
                if (itemKey === identifier || item.id === identifier) {
                    const newQuantity = (Number(item.quantity) || 1) + delta;
                    if (newQuantity <= 0) {
                        return []; // Buang barangan serta-merta apabila kuantiti ditolak sehingga 0
                    }
                    return [{ ...item, quantity: newQuantity, cartKey: itemKey }];
                }
                return [item];
            })
        );
    };

    /**
     * Sets exact quantity for an item. If quantity <= 0, item is removed.
     * @param {string} identifier - The cartKey or product ID.
     * @param {number|string} qty - The target quantity.
     */
    const setQuantity = (identifier, qty) => {
        if (!identifier) return;
        const targetQty = parseInt(qty, 10);
        if (isNaN(targetQty) || targetQty <= 0) {
            removeFromCart(identifier);
            return;
        }
        setCartItems((prev) =>
            prev.map((item) => {
                const itemKey = item.cartKey || getCartItemKey(item.id, item.selectedColor);
                if (itemKey === identifier || item.id === identifier) {
                    return { ...item, quantity: targetQty, cartKey: itemKey };
                }
                return item;
            })
        );
    };

    const clearCart = () => setCartItems([]);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const openSidebar = () => setIsSidebarOpen(true);
    const closeSidebar = () => setIsSidebarOpen(false);

    // Using Turkish field 'fiyat' from schema, prefer indirimliFiyat if available
    const cartTotal = cartItems.reduce((sum, item) => {
        const price = Number(item.indirimliFiyat || item.fiyat) || 0;
        return sum + price * item.quantity;
    }, 0);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                setQuantity,
                clearCart,
                isSidebarOpen,
                setIsSidebarOpen,
                toggleSidebar,
                openSidebar,
                closeSidebar,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

/**
 * Custom hook to use the CartContext.
 * @returns {Object} The cart context value including state and methods.
 */
export const useCart = () => useContext(CartContext);
