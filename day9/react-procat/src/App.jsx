import { useMemo, useState } from "react";
import "./App.css";

const products = [
  {
    id: 1,
    name: "Galaxy Pro Phone",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
    description: "Immersive AMOLED display with fast charging and premium camera performance.",
    oldPrice: "₹29,999",
    price: "₹24,999",
    discount: "20% OFF",
    rating: "★★★★★",
    reviews: "1.2k reviews",
  },
  {
    id: 2,
    name: "NovaBook Laptop",
    category: "Computing",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
    description: "Powerful multitasking laptop with a sleek aluminum design and vivid display.",
    oldPrice: "₹74,999",
    price: "₹64,999",
    discount: "15% OFF",
    rating: "★★★★★",
    reviews: "980 reviews",
  },
  {
    id: 3,
    name: "Echo Air Headphones",
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    description: "Studio-grade sound with adaptive noise cancellation for distraction-free focus.",
    oldPrice: "₹5,999",
    price: "₹3,999",
    discount: "30% OFF",
    rating: "★★★★☆",
    reviews: "760 reviews",
  },
  {
    id: 4,
    name: "Orbit Smart Watch",
    category: "Wearables",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    description: "Track fitness, sleep, and heart health with a bright always-on display.",
    oldPrice: "₹8,999",
    price: "₹6,499",
    discount: "25% OFF",
    rating: "★★★★★",
    reviews: "1.5k reviews",
  },
  {
    id: 5,
    name: "Luma Wireless Speaker",
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600",
    description: "Rich 360° sound with deep bass and portable all-day battery life.",
    oldPrice: "₹7,999",
    price: "₹5,499",
    discount: "31% OFF",
    rating: "★★★★☆",
    reviews: "640 reviews",
  },
  {
    id: 6,
    name: "Pixel Mini Camera",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600",
    description: "Compact mirrorless camera with stunning image quality and cinematic video.",
    oldPrice: "₹45,999",
    price: "₹39,999",
    discount: "13% OFF",
    rating: "★★★★★",
    reviews: "890 reviews",
  },
  {
    id: 7,
    name: "Aero Gaming Mouse",
    category: "Computing",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
    description: "Ultra-responsive gaming mouse with customizable RGB lighting and precision sensors.",
    oldPrice: "₹4,299",
    price: "₹2,999",
    discount: "30% OFF",
    rating: "★★★★☆",
    reviews: "520 reviews",
  },
  {
    id: 8,
    name: "ZenFit Smart Band",
    category: "Wearables",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600",
    description: "Sleep and activity tracking in a lightweight design with AMOLED display.",
    oldPrice: "₹3,499",
    price: "₹2,299",
    discount: "34% OFF",
    rating: "★★★★★",
    reviews: "1.1k reviews",
  },
];

const categories = ["All", "Electronics", "Computing", "Audio", "Wearables"];

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;
      const searchText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
      const matchesSearch = searchText.includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div>
            <h3>ShopEase</h3>
            <p>Premium marketplace</p>
          </div>
        </div>

        <nav className="nav-links">
          <a href="#">Home</a>
          <a href="#catalog">Products</a>
          <a href="#">Deals</a>
          <a href="#">Support</a>
        </nav>

        <div className="header-actions">
          <button className="pill-btn">Wishlist</button>
          <button className="pill-btn cart-btn">Cart (2)</button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Curated for modern living</span>
            <h1>Discover standout products built for everyday life.</h1>
            <p>
              Explore premium essentials with seamless delivery, trusted reviews,
              and exceptional value.
            </p>

            <div className="hero-actions">
              <a href="#catalog" className="btn primary">
                Shop now
              </a>
              <a href="#" className="btn secondary">
                Explore offers
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>4.9/5</strong>
                <span>Rated by shoppers</span>
              </div>
              <div>
                <strong>24h</strong>
                <span>Fast dispatch</span>
              </div>
              <div>
                <strong>Free</strong>
                <span>Returns</span>
              </div>
            </div>
          </div>

          <div className="hero-card">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
              alt="Featured smartwatch"
            />
            <div className="hero-card-info">
              <span className="hero-badge">Trending now</span>
              <h3>Orbit Smart Watch</h3>
              <p>Track every step with accurate health insights effortlessly.</p>
            </div>
          </div>
        </section>

        <section className="filters" id="catalog">
          <div className="filter-heading">
            <div>
              <h2>Featured collection</h2>
              <p>{filteredProducts.length} products ready to ship</p>
            </div>
          </div>

          <div className="filter-controls">
            <label className="search-box">
              <span>🔍</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products"
              />
            </label>

            <div className="chip-row">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`chip ${activeCategory === category ? "active" : ""}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="catalog-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="card-media">
                  <img src={product.image} alt={product.name} />
                  <span className="card-badge">{product.discount}</span>
                  <button className="icon-btn" aria-label="Save product">
                    ♡
                  </button>
                </div>

                <div className="card-body">
                  <div className="card-top">
                    <p className="category">{product.category}</p>
                    <div className="rating">
                      {product.rating} · {product.reviews}
                    </div>
                  </div>

                  <h3>{product.name}</h3>
                  <p>{product.description}</p>

                  <div className="price-row">
                    <div>
                      <span className="old-price">{product.oldPrice}</span>
                      <span className="new-price">{product.price}</span>
                    </div>
                    <button className="buy-btn">Add to cart</button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <h3>No products matched your search.</h3>
              <p>Try another keyword or switch categories.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <h3>ShopEase</h3>
        <p>Your trusted destination for quality products and thoughtful design.</p>
        <p>© 2026 ShopEase. All rights reserved.</p>
      </footer>
    </div>
  );
}