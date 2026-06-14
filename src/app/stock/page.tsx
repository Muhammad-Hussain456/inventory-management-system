"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    quantity: 0,
    minQuantity: 10,
    price: "",
    category: "",
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in and is admin
    const stored = sessionStorage.getItem("user");
    if (!stored) {
      router.push("/auth");
      return;
    }
    const userData = JSON.parse(stored);
    if (userData.role !== "admin") {
      router.push("/stock");
      return;
    }
    setUser(userData);
    refresh();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    router.push("/auth");
  };

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  };

  const handleAdd = async (e: any) => {
    e.preventDefault();
    await fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowAdd(false);
    setForm({
      name: "",
      sku: "",
      quantity: 0,
      minQuantity: 10,
      price: "",
      category: "",
    });
    refresh();
  };
  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`⚠️ Delete "${name}"?\n\nThis cannot be undone!`)) {
      await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      refresh();
    }
  };
  const handleAdjust = async (id: number, type: string) => {
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "adjust", id, type, qty: 1 }),
      });

      if (res.ok) {
        refresh(); // Refresh the list
      } else {
        const error = await res.json();
        alert(error.error || "Failed to update stock");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  const filtered = products.filter(
    (p: any) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    total: products.length,
    inStock: products.filter((p: any) => p.quantity > 0).length,
    lowStock: products.filter(
      (p: any) => p.quantity <= p.minQuantity && p.quantity > 0,
    ).length,
    outStock: products.filter((p: any) => p.quantity === 0).length,
  };

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: 20,
        fontFamily: "system-ui",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: "bold" }}>📦 StockFlow</h1>

        <button
          onClick={() => setShowAdd(true)}
          style={{
            padding: "10px 20px",
            background: "#2563EB",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          + Add Product
        </button>
        <a
          href="/"
          style={{
            padding: "10px 20px",
            background: "#F3F4F6",
            color: "#374151",
            textDecoration: "none",
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          🛒 Customer Store
        </a>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 15,
          marginBottom: 30,
        }}
      >
        {[
          {
            label: "Total",
            value: stats.total,
            color: "#EFF6FF",
            textColor: "#1E40AF",
          },
          {
            label: "In Stock",
            value: stats.inStock,
            color: "#F0FDF4",
            textColor: "#166534",
          },
          {
            label: "Low Stock",
            value: stats.lowStock,
            color: "#FEFCE8",
            textColor: "#854D0E",
          },
          {
            label: "Out of Stock",
            value: stats.outStock,
            color: "#FEF2F2",
            textColor: "#991B1B",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{ background: s.color, padding: 20, borderRadius: 12 }}
          >
            <div
              style={{ fontSize: 32, fontWeight: "bold", color: s.textColor }}
            >
              {s.value}
            </div>
            <div style={{ color: s.textColor, marginTop: 5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="🔍 Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          border: "1px solid #E5E7EB",
          borderRadius: 8,
          marginBottom: 20,
          fontSize: 14,
          boxSizing: "border-box",
        }}
      />

      <div
        style={{
          background: "white",
          borderRadius: 12,
          border: "1px solid #E5E7EB",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                background: "#F9FAFB",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              <th
                style={{
                  padding: 12,
                  textAlign: "left",
                  fontSize: 13,
                  color: "#6B7280",
                }}
              >
                Product
              </th>
              <th
                style={{
                  padding: 12,
                  textAlign: "left",
                  fontSize: 13,
                  color: "#6B7280",
                }}
              >
                Category
              </th>
              <th
                style={{
                  padding: 12,
                  textAlign: "left",
                  fontSize: 13,
                  color: "#6B7280",
                }}
              >
                Stock
              </th>
              <th
                style={{
                  padding: 12,
                  textAlign: "left",
                  fontSize: 13,
                  color: "#6B7280",
                }}
              >
                Price
              </th>
              <th
                style={{
                  padding: 12,
                  textAlign: "left",
                  fontSize: 13,
                  color: "#6B7280",
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: 12,
                  textAlign: "right",
                  fontSize: 13,
                  color: "#6B7280",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{ padding: 40, textAlign: "center", color: "#9CA3AF" }}
                >
                  No products found
                </td>
              </tr>
            ) : (
              filtered.map((p: any) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 500 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                      SKU: {p.sku}
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        background: "#F3F4F6",
                        padding: "4px 10px",
                        borderRadius: 20,
                        fontSize: 12,
                      }}
                    >
                      {p.category || "Uncategorized"}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{ fontFamily: "monospace", fontWeight: "bold" }}
                    >
                      {p.quantity}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    {p.price ? `$${Number(p.price).toFixed(2)}` : "-"}
                  </td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 20,
                        fontSize: 12,
                        background:
                          p.quantity === 0
                            ? "#FEE2E2"
                            : p.quantity <= p.minQuantity
                              ? "#FEF3C7"
                              : "#D1FAE5",
                        color:
                          p.quantity === 0
                            ? "#991B1B"
                            : p.quantity <= p.minQuantity
                              ? "#92400E"
                              : "#065F46",
                      }}
                    >
                      {p.quantity === 0
                        ? "Out of Stock"
                        : p.quantity <= p.minQuantity
                          ? "Low Stock"
                          : "In Stock"}
                    </span>
                  </td>
                  <td style={{ padding: 12, textAlign: "right" }}>
                    <button
                      onClick={() => handleAdjust(p.id, "out")}
                      disabled={p.quantity === 0}
                      style={{
                        padding: "6px 12px",
                        marginRight: 5,
                        border: "1px solid #E5E7EB",
                        background: "white",
                        borderRadius: 6,
                        cursor: p.quantity === 0 ? "not-allowed" : "pointer",
                        opacity: p.quantity === 0 ? 0.5 : 1,
                      }}
                    >
                      ➖
                    </button>
                    <button
                      onClick={() => handleAdjust(p.id, "in")}
                      style={{
                        padding: "6px 12px",
                        border: "1px solid #E5E7EB",
                        background: "white",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      ➕
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      style={{
                        padding: "6px 12px",
                        marginLeft: 5,
                        background: "#FEE2E2",
                        color: "#DC2626",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 14,
                      }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: 30,
              borderRadius: 12,
              width: "90%",
              maxWidth: 450,
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
              Add Product
            </h2>
            <form onSubmit={handleAdd}>
              <input
                type="text"
                placeholder="Product Name *"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{
                  width: "100%",
                  padding: 10,
                  border: "1px solid #E5E7EB",
                  borderRadius: 6,
                  marginBottom: 10,
                  boxSizing: "border-box",
                }}
              />
              <input
                type="text"
                placeholder="SKU *"
                required
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                style={{
                  width: "100%",
                  padding: 10,
                  border: "1px solid #E5E7EB",
                  borderRadius: 6,
                  marginBottom: 10,
                  boxSizing: "border-box",
                }}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <input
                  type="number"
                  placeholder="Quantity"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: Number(e.target.value) })
                  }
                  style={{
                    padding: 10,
                    border: "1px solid #E5E7EB",
                    borderRadius: 6,
                    boxSizing: "border-box",
                  }}
                />
                <input
                  type="number"
                  placeholder="Min Quantity"
                  value={form.minQuantity}
                  onChange={(e) =>
                    setForm({ ...form, minQuantity: Number(e.target.value) })
                  }
                  style={{
                    padding: 10,
                    border: "1px solid #E5E7EB",
                    borderRadius: 6,
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                style={{
                  width: "100%",
                  padding: 10,
                  border: "1px solid #E5E7EB",
                  borderRadius: 6,
                  marginBottom: 10,
                  boxSizing: "border-box",
                }}
              />
              <input
                type="text"
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{
                  width: "100%",
                  padding: 10,
                  border: "1px solid #E5E7EB",
                  borderRadius: 6,
                  marginBottom: 20,
                  boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  style={{
                    flex: 1,
                    padding: 10,
                    border: "1px solid #E5E7EB",
                    background: "white",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: 10,
                    background: "#2563EB",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
