"use client";

import { useState, useMemo, useEffect } from "react";
import styles from "./POS.module.css";

const CATEGORY_COLORS = ["#1a202c", "#3182ce", "#4299e1", "#48bb78", "#ed64a6"];

export default function POS({ data }) {
  const { categories = [], products = [], addonGroups = [], tables = [], customers = [] } = data || {};

  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id ?? null);
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState("TAKEAWAY");
  const [orderNumber, setOrderNumber] = useState("#---");
  useEffect(() => {
    setOrderNumber(`#${Math.floor(800 + Math.random() * 200)}`);
  }, []);
  const [addonProduct, setAddonProduct] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState({});
  const [placing, setPlacing] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!selectedCategoryId) return products;
    return products.filter((p) => p.categoryId === selectedCategoryId);
  }, [products, selectedCategoryId]);

  const addToCart = (product, addons = []) => {
    const addonTotal = addons.reduce((s, a) => s + Number(a.price || 0), 0);
    const unitPrice = Number(product.basePrice) + addonTotal;
    const modifierNames = addons.map((a) => a.name).join(", ");

    setCart((prev) => {
      const existing = prev.find(
        (i) => i.productId === product.id && i.modifierNames === modifierNames
      );
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          unitPrice,
          taxRate: Number(product.taxRate) || 10,
          quantity: 1,
          addonTotal,
          modifierNames,
          addons,
        },
      ];
    });
    setAddonProduct(null);
    setSelectedAddons({});
  };

  const openAddonModal = (product) => {
    if (addonGroups.length > 0) {
      setAddonProduct(product);
      setSelectedAddons({});
    } else {
      addToCart(product, []);
    }
  };

  const toggleAddon = (groupId, item) => {
    setSelectedAddons((prev) => {
      const group = prev[groupId] || [];
      const exists = group.find((i) => i.id === item.id);
      const newGroup = exists
        ? group.filter((i) => i.id !== item.id)
        : [...group, item];
      return { ...prev, [groupId]: newGroup };
    });
  };

  const confirmAddWithAddons = () => {
    const addons = Object.values(selectedAddons).flat();
    addToCart(addonProduct, addons);
  };

  const updateCartItemQty = (index, delta) => {
    setCart((prev) => {
      const item = prev[index];
      const newQty = item.quantity + delta;
      if (newQty <= 0) return prev.filter((_, i) => i !== index);
      return prev.map((i, idx) => (idx === index ? { ...i, quantity: newQty } : i));
    });
  };

  const removeCartItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const taxAmount = subtotal * 0.1;
  const grandTotal = subtotal + taxAmount;

  const placeOrder = async () => {
    if (cart.length === 0) return;
    setPlacing(true);
    try {
      const res = await fetch("/api/pos/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((i) => ({
            productId: i.productId,
            productName: i.productName,
            unitPrice: i.unitPrice,
            taxRate: i.taxRate,
            quantity: i.quantity,
          })),
          orderType,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setCart([]);
      alert(`Order ${json.orderNumber} placed successfully!`);
    } catch (err) {
      alert(err.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    if (confirm("Clear all items?")) setCart([]);
  };

  return (
    <div className={styles.pos}>
      <div className={styles.productsPanel}>
        <div className={styles.posHeader}>
          <span className={styles.posBrand}>Restaurant POS</span>
          <div className={styles.posCategories}>
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                className={`${styles.posCategoryTab} ${
                  selectedCategoryId === cat.id ? styles.posCategoryTabActive : styles.posCategoryTabInactive
                }`}
                style={
                  selectedCategoryId === cat.id
                    ? { background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }
                    : {}
                }
                onClick={() => setSelectedCategoryId(cat.id)}
              >
                {cat.name}
              </button>
            ))}
            {categories.length === 0 && (
              <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No categories</span>
            )}
          </div>
        </div>

        <div className={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={styles.productCard}
              onClick={() => openAddonModal(product)}
            >
              <div className={styles.productImage}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} />
                ) : (
                  <span>🍽</span>
                )}
              </div>
              <div className={styles.productName}>{product.name}</div>
              <div className={styles.productDesc}>{product.description}</div>
              <div className={styles.productPrice}>
                €{Number(product.basePrice).toLocaleString()}
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className={styles.emptyCart}>No products in this category</div>
          )}
        </div>
      </div>

      <div className={styles.cartPanel}>
        <div className={styles.cartHeader}>
          <div className={styles.cartOrderType}>{orderType === "TAKEAWAY" ? "Takeaway" : "Dine-In"}</div>
          <div className={styles.cartOrderNumber}>Order {orderNumber}</div>
        </div>

        <div className={styles.cartItems}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>Add items from the menu</div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className={styles.cartItem}>
                <div className={styles.cartItemMain}>
                  <span className={styles.cartItemName}>
                    {item.quantity}× {item.productName}
                  </span>
                  <span className={styles.cartItemPrice}>
                    €{(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
                {item.modifierNames && (
                  <div className={styles.cartItemModifiers}>
                    {item.modifierNames.split(", ").map((m, i) => (
                      <span key={i} className={styles.cartModifier}>
                        {m}
                      </span>
                    ))}
                  </div>
                )}
                <div className={styles.cartItemQty}>
                  <button
                    onClick={() => updateCartItemQty(index, -1)}
                    style={{ marginRight: 8 }}
                  >
                    −
                  </button>
                  {item.quantity}
                  <button
                    onClick={() => updateCartItemQty(index, 1)}
                    style={{ marginLeft: 8 }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.cartSummary}>
          <div className={styles.cartSummaryRow}>
            <span>Total Order</span>
            <span>€{subtotal.toLocaleString()}</span>
          </div>
          <div className={styles.cartSummaryRow}>
            <span>Tax (10%)</span>
            <span>€{taxAmount.toLocaleString()}</span>
          </div>
          <div className={styles.cartSummaryRow}>
            <span>Discount</span>
            <span>€0</span>
          </div>
          <div className={`${styles.cartSummaryRow} ${styles.cartSummaryTotal}`}>
            <span>Total Payable</span>
            <span>€{grandTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className={styles.cartActions}>
          <button className={styles.cartActionBtn} onClick={() => cart[0] && updateCartItemQty(0, -1)}>
            −
          </button>
          <button className={styles.cartActionBtn} onClick={() => cart[0] && updateCartItemQty(0, 1)}>
            +
          </button>
          <button className={styles.cartActionBtn} title="Print">
            🖨
          </button>
        </div>

        <div className={styles.cartPrimaryBtns}>
          <button
            className={`${styles.cartPrimaryBtn} ${styles.cartPrimaryBtnCancel}`}
            onClick={clearCart}
          >
            Cancel
          </button>
          <button
            className={`${styles.cartPrimaryBtn} ${styles.cartPrimaryBtnPay}`}
            onClick={placeOrder}
            disabled={cart.length === 0 || placing}
          >
            {placing ? "..." : "Pay"}
          </button>
          <button
            className={`${styles.cartPrimaryBtn} ${styles.cartPrimaryBtnExit}`}
          >
            Exit
          </button>
        </div>
      </div>

      {addonProduct && (
        <div className={styles.addonOverlay} onClick={() => setAddonProduct(null)}>
          <div className={styles.addonModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.addonModalHeader}>
              Add modifiers: {addonProduct.name}
            </div>
            <div className={styles.addonModalBody}>
              {addonGroups.length > 0 ? (
                addonGroups.map((group) => (
                  <div key={group.id} className={styles.addonGroup}>
                    <div className={styles.addonGroupTitle}>
                      {group.name} (min: {group.minSelect}, max: {group.maxSelect})
                    </div>
                    <div className={styles.addonItems}>
                      {group.addonItems.map((item) => {
                        const selected = (selectedAddons[group.id] || []).some(
                          (i) => i.id === item.id
                        );
                        return (
                          <button
                            key={item.id}
                            className={`${styles.addonChip} ${selected ? styles.addonChipSelected : ""}`}
                            onClick={() => toggleAddon(group.id, item)}
                          >
                            {item.name} (+€{Number(item.price).toLocaleString()})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#718096" }}>No add-ons available</p>
              )}
            </div>
            <div className={styles.addonModalFooter}>
              <button
                className={`${styles.addonModalBtn} ${styles.addonModalBtnCancel}`}
                onClick={() => setAddonProduct(null)}
              >
                Cancel
              </button>
              <button
                className={`${styles.addonModalBtn} ${styles.addonModalBtnAdd}`}
                onClick={confirmAddWithAddons}
              >
                Add to Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
