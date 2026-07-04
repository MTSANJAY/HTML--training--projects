import { useMemo, useState } from "react";
import "./App.css";

const products = [
  {
    id: 1,
    name: "iPhone 16 Pro",
    category: "Mobile",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
    description: "A18 Chip • 256GB Storage • Titanium Design",
    oldPrice: 134999,
    price: 119999,
    discount: "11% OFF",
    rating: 4.9,
  },
  {
    id: 2,
    name: "MacBook Air M3",
    category: "Laptop",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
    description: "Apple M3 • 16GB RAM • 512GB SSD",
    oldPrice: 129999,
    price: 114999,
    discount: "12% OFF",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    description: "Wireless Noise Cancelling Headphones",
    oldPrice: 34999,
    price: 28999,
    discount: "18% OFF",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Apple Watch Ultra",
    category: "Watch",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    description: "GPS • Heart Rate • Waterproof",
    oldPrice: 99999,
    price: 89999,
    discount: "10% OFF",
    rating: 4.9,
  },
  {
    id: 5,
    name: "Samsung Galaxy S25",
    category: "Mobile",
    image:
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600",
    description: "Snapdragon • AMOLED Display",
    oldPrice: 89999,
    price: 79999,
    discount: "15% OFF",
    rating: 4.6,
  },
  {
    id: 6,
    name: "Dell XPS 15",
    category: "Laptop",
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=600",
    description: "Intel i7 • RTX Graphics",
    oldPrice: 159999,
    price: 139999,
    discount: "13% OFF",
    rating: 4.8,
  },
];

const categories = ["All", "Mobile", "Laptop", "Audio", "Watch"];

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchSearch = product.name
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchCategory = category === "All" || product.category === category;

        return matchSearch && matchCategory;
      }),
    [search, category]
  );

  const topRatedProducts = useMemo(
    () =>
      products
        .filter((product) => product.rating >= 4.7)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3),
    []
  );

  const addToCart = () => {
    setCartCount((current) => current + 1);
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <span className="logo">ShopEase</span>
          <p>Curated gadgets with premium deals.</p>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search latest products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="nav-icons">
          <button className="icon-btn" aria-label="Wishlist">
            ❤️
          </button>
          <button className="icon-btn cart-count" aria-label="Cart">
            🛒 {cartCount}
          </button>
          <button className="icon-btn" aria-label="Profile">
            👤
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Top rated products</span>
          <h1>Shop the best gadgets for modern living.</h1>
          <p>
            Fast delivery, transparent pricing, and handpicked devices for your
            everyday lifestyle.
          </p>

          <div className="hero-actions">
            <button className="hero-cta">Explore premium deals</button>
            <button className="hero-secondary">See latest arrivals</button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <strong>6</strong>
              <span>Curated picks</span>
            </div>
            <div className="stat">
              <strong>4.8</strong>
              <span>Average rating</span>
            </div>
            <div className="stat">
              <strong>Free</strong>
              <span>Delivery on all orders</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="highlight-card">
            <div className="highlight-top">
              <span>Daily deal</span>
              <strong>Up to 18% off</strong>
            </div>
            <div className="highlight-body">
              <h2>Shop smart with premium gadget bundles</h2>
              <p>
                Save more with exclusive offers on laptops, smartphones, audio,
                and wearables.
              </p>
            </div>
            <div className="highlight-list">
              <div className="highlight-point">
                <span>✓</span>
                <p>Secure checkout and fast shipping</p>
              </div>
              <div className="highlight-point">
                <span>✓</span>
                <p>Trusted brands with top customer reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="top-rated">
        <div className="section-header">
          <div>
            <span className="eyebrow">Top rated</span>
            <h2>Customers love these favorites.</h2>
          </div>
          <button className="view-all" onClick={() => setSearch("")}>View all</button>
        </div>

        <div className="top-rated-grid">
          {topRatedProducts.map((product) => (
            <button
              key={product.id}
              className="top-rated-card"
              onClick={() => setSearch(product.name)}
            >
              <div className="top-rated-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="top-rated-details">
                <span className="tag">{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </div>
              <div className="top-rated-meta">
                <span>⭐ {product.rating}</span>
                <span>₹{product.price.toLocaleString()}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="categories">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "active" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </section>

      <section className="products">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "active" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </section>

      <section className="products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <article className="card" key={product.id}>
              <div className="card-top">
                <span className="badge">{product.discount}</span>
                <button className="wishlist" aria-label="Add to wishlist">
                  ❤️
                </button>
              </div>

              <div className="image-wrap">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="content">
                <span className="tag">{product.category}</span>
                <h2>{product.name}</h2>
                <p className="description">{product.description}</p>

                <div className="product-status">
                  <span className="rating-pill">⭐ {product.rating}</span>
                  <span className="stock-pill">In stock</span>
                  <span className="delivery">Free delivery</span>
                </div>

                <div className="price-row">
                  <span className="old">
                    ₹{product.oldPrice.toLocaleString()}
                  </span>
                  <span className="new">
                    ₹{product.price.toLocaleString()}
                  </span>
                </div>

                <div className="buttons">
                  <button className="cart-btn" onClick={addToCart}>
                    Add to Cart
                  </button>
                  <button className="buy-btn">Buy Now</button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <h2>No products matched your search.</h2>
            <p>Try another keyword or select a different category.</p>
          </div>
        )}
      </section>

      <footer className="footer">
        <div className="footer-brand">
          <h2>ShopEase</h2>
          <p>Your trusted online shopping store.</p>
        </div>

        <div className="footer-links">
          <a href="#">Home</a>
          <a href="#">Products</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>

        <p>© 2026 ShopEase. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
