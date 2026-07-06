import { useMemo, useState } from "react";
import "./App.css";

const products = [
  {
    id: 1,
    name: "Samsung Galaxy A15 5G",
    brand: "Samsung",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=900&q=80",
    description: "5G phone with AMOLED display and long battery life",
    oldPrice: 22999,
    price: 18999,
    rating: 4.4,
    tag: "Budget 5G",
  },
  {
    id: 2,
    name: "Samsung Galaxy A25 5G",
    brand: "Samsung",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80",
    description: "Smooth display, strong camera, everyday performance",
    oldPrice: 27999,
    price: 23999,
    rating: 4.5,
    tag: "Popular",
  },
  {
    id: 3,
    name: "Samsung Galaxy M35",
    brand: "Samsung",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=900&q=80",
    description: "Big battery, fast charger, smooth entertainment",
    oldPrice: 24999,
    price: 21999,
    rating: 4.6,
    tag: "Battery",
  },
  {
    id: 4,
    name: "Samsung Galaxy A35",
    brand: "Samsung",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&q=80",
    description: "Balanced performance with premium display quality",
    oldPrice: 32999,
    price: 28999,
    rating: 4.5,
    tag: "Balanced",
  },
  {
    id: 5,
    name: "Samsung Galaxy A55",
    brand: "Samsung",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=900&q=80",
    description: "Premium design, clear camera, strong daily speed",
    oldPrice: 42999,
    price: 36999,
    rating: 4.6,
    tag: "Premium",
  },
  {
    id: 6,
    name: "Samsung Galaxy S23 FE",
    brand: "Samsung",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=900&q=80",
    description: "Flagship feel with high quality camera and display",
    oldPrice: 44999,
    price: 37999,
    rating: 4.7,
    tag: "Flagship FE",
  },
  {
    id: 7,
    name: "Samsung Galaxy S24",
    brand: "Samsung",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80",
    description: "AI features, bright AMOLED display, premium camera",
    oldPrice: 59999,
    price: 51999,
    rating: 4.8,
    tag: "AI Phone",
  },
  {
    id: 8,
    name: "Samsung Galaxy S24 FE",
    brand: "Samsung",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&q=80",
    description: "Premium camera, strong battery, smooth multitasking",
    oldPrice: 64999,
    price: 59999,
    rating: 4.7,
    tag: "Creator",
  },
  {
    id: 9,
    name: "Samsung Galaxy Z Flip6",
    brand: "Samsung",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=900&q=80",
    description: "Foldable compact design with premium performance",
    oldPrice: 89999,
    price: 79999,
    rating: 4.6,
    tag: "Foldable",
  },
  {
    id: 10,
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=900&q=80",
    description: "Ultra camera system, S Pen, pro-grade performance",
    oldPrice: 139999,
    price: 124999,
    rating: 4.9,
    tag: "Ultra",
  },
  {
    id: 11,
    name: "Samsung Galaxy Book Go",
    brand: "Samsung",
    category: "Laptop",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=900&q=80",
    description: "Lightweight laptop for study and daily productivity",
    oldPrice: 43999,
    price: 35999,
    rating: 4.2,
    tag: "Student",
  },
  {
    id: 12,
    name: "Samsung Galaxy Book2",
    brand: "Samsung",
    category: "Laptop",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80",
    description: "Thin laptop with reliable office performance",
    oldPrice: 67999,
    price: 57999,
    rating: 4.4,
    tag: "Work",
  },
  {
    id: 13,
    name: "Samsung Galaxy Book3",
    brand: "Samsung",
    category: "Laptop",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80",
    description: "Sharp display, fast SSD, slim productivity build",
    oldPrice: 84999,
    price: 74999,
    rating: 4.5,
    tag: "Slim",
  },
  {
    id: 14,
    name: "Samsung Galaxy Book4",
    brand: "Samsung",
    category: "Laptop",
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=900&q=80",
    description: "Modern laptop with bright screen and smooth speed",
    oldPrice: 99999,
    price: 89999,
    rating: 4.6,
    tag: "New",
  },
  {
    id: 15,
    name: "Samsung Galaxy Book4 Pro",
    brand: "Samsung",
    category: "Laptop",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=900&q=80",
    description: "Pro display and premium performance for creators",
    oldPrice: 139999,
    price: 124999,
    rating: 4.8,
    tag: "Pro",
  },
  {
    id: 16,
    name: "Samsung Galaxy Tab S9",
    brand: "Samsung",
    category: "Tablet",
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=900&q=80",
    description: "Premium tablet for notes, media, and creative work",
    oldPrice: 79999,
    price: 69999,
    rating: 4.7,
    tag: "Tablet",
  },
  {
    id: 17,
    name: "iPhone 15",
    brand: "Apple",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80",
    description: "USB-C, Dynamic Island, excellent camera system",
    oldPrice: 79999,
    price: 69999,
    rating: 4.9,
    tag: "Premium",
  },
  {
    id: 18,
    name: "iPhone 16",
    brand: "Apple",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=900&q=80",
    description: "Latest Apple Intelligence ready mobile experience",
    oldPrice: 89999,
    price: 79999,
    rating: 4.9,
    tag: "New",
  },
  {
    id: 19,
    name: "MacBook Air M3",
    brand: "Apple",
    category: "Laptop",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80",
    description: "M3 chip, 16GB RAM, 512GB SSD, thin aluminium body",
    oldPrice: 129999,
    price: 114999,
    rating: 4.8,
    tag: "Creator",
  },
  {
    id: 20,
    name: "OnePlus Nord CE 4",
    brand: "OnePlus",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=900&q=80",
    description: "5G performance, AMOLED display, premium finish",
    oldPrice: 28999,
    price: 24999,
    rating: 4.5,
    tag: "Popular",
  },
  {
    id: 21,
    name: "Lenovo IdeaPad Slim 5",
    brand: "Lenovo",
    category: "Laptop",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80",
    description: "Ryzen 7, 16GB RAM, lightweight productivity laptop",
    oldPrice: 79999,
    price: 69999,
    rating: 4.6,
    tag: "Student",
  },
  {
    id: 22,
    name: "ASUS TUF Gaming A15",
    brand: "Asus",
    category: "Laptop",
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=900&q=80",
    description: "Gaming power, strong cooling, RTX graphics",
    oldPrice: 89999,
    price: 74999,
    rating: 4.7,
    tag: "Gaming",
  },
  {
    id: 23,
    name: "Dell XPS 15",
    brand: "Dell",
    category: "Laptop",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=900&q=80",
    description: "Premium display, Intel i7, creator-ready performance",
    oldPrice: 159999,
    price: 139999,
    rating: 4.8,
    tag: "Pro",
  },
  {
    id: 24,
    name: "Vivo V40 Pro",
    brand: "Vivo",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=900&q=80",
    description: "Camera-focused phone with elegant premium design",
    oldPrice: 44999,
    price: 39999,
    rating: 4.5,
    tag: "Camera",
  },
];
const MIN_PRICE = 15000;
const MAX_PRICE = 150000;
const categories = ["All", "Mobile", "Laptop", "Tablet"];

function App() {
  const [brandSearch, setBrandSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [cartCount, setCartCount] = useState(0);

  const brands = useMemo(
    () => [...new Set(products.map((product) => product.brand))].sort(),
    []
  );

  const safeMaxPrice = Math.min(
    MAX_PRICE,
    Math.max(MIN_PRICE, Number(maxPrice) || MIN_PRICE)
  );

  const filteredProducts = useMemo(() => {
    const searchedBrand = brandSearch.trim().toLowerCase();

    return products.filter((product) => {
      const matchesBrand =
        searchedBrand === "" || product.brand.toLowerCase() === searchedBrand;
      const matchesCategory = category === "All" || product.category === category;
      const matchesPrice = product.price >= MIN_PRICE && product.price <= safeMaxPrice;

      return matchesBrand && matchesCategory && matchesPrice;
    });
  }, [brandSearch, category, safeMaxPrice]);

  const selectedBrandName = brandSearch.trim() || "All brands";

  return (
    <main className="app">
      <header className="navbar">
        <div className="brand-mark">
          <div className="logo">D</div>
          <div>
            <h1>D Mart&Co</h1>
            <p>Premium product catalog</p>
          </div>
        </div>

        <button className="cart-button">Cart {cartCount}</button>
      </header>

      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">Premium Tech Store</span>
          <h2>Search by brand. Set your amount.</h2>
          <p>
            Type a brand name and enter any amount from Rs. 15,000 to
            Rs. 1,50,000. For example, search Samsung and set 150000 to see
            more than 15 Samsung products.
          </p>

          <div className="search-card">
            <label>
              Brand name
              <input
                type="text"
                list="brand-options"
                placeholder="Example: Samsung"
                value={brandSearch}
                onChange={(event) => setBrandSearch(event.target.value)}
              />
            </label>

            <label>
              Amount up to
              <input
                type="number"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step="1000"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
              />
            </label>
          </div>

          <datalist id="brand-options">
            {brands.map((brand) => (
              <option key={brand} value={brand} />
            ))}
          </datalist>
        </div>

        <aside className="deal-card">
          <span>Selected Filter</span>
          <strong>
            Rs. {MIN_PRICE.toLocaleString("en-IN")} - Rs.{" "}
            {safeMaxPrice.toLocaleString("en-IN")}
          </strong>
          <p>{selectedBrandName} products only</p>
        </aside>
      </section>

      <section className="category-bar">
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

      <section className="summary">
        <div>
          <span className="eyebrow">Results</span>
          <h2>{filteredProducts.length} products found</h2>
        </div>
        <button
          className="clear-button"
          onClick={() => {
            setBrandSearch("");
            setCategory("All");
            setMaxPrice(MAX_PRICE);
          }}
        >
          Clear Filters
        </button>
      </section>

      <section className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="image-box">
                <img src={product.image} alt={product.name} />
                <span className="badge">{product.tag}</span>
              </div>

              <div className="product-info">
                <div className="product-meta">
                  <span>{product.brand}</span>
                  <span>Star {product.rating}</span>
                </div>

                <h3>{product.name}</h3>
                <p>{product.description}</p>

                <div className="price-row">
                  <del>Rs. {product.oldPrice.toLocaleString("en-IN")}</del>
                  <strong>Rs. {product.price.toLocaleString("en-IN")}</strong>
                </div>

                <div className="actions">
                  <button onClick={() => setCartCount((count) => count + 1)}>
                    Add to Cart
                  </button>
                  <button className="secondary">Buy Now</button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Try another brand name or increase the price amount.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;




