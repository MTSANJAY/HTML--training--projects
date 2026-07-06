import { useState } from "react";
import "./App.css";

const products = [
  {
    id: 1,
    name: "iPhone 16 Pro",
    category: "Mobile",
    price: 129999,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
  },
  {
    id: 2,
    name: "MacBook Pro",
    category: "Laptop",
    price: 189999,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=800",
  },
  {
    id: 3,
    name: "Sony Headphones",
    category: "Accessories",
    price: 15999,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
  },
  {
    id: 4,
    name: "Apple Watch",
    category: "Accessories",
    price: 49999,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800",
  },
  {
    id: 5,
    name: "Samsung Galaxy S25",
    category: "Mobile",
    price: 99999,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800",
  },
  {
    id: 6,
    name: "Dell XPS 15",
    category: "Laptop",
    price: 145000,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
  },
];

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Mobile", "Laptop", "Accessories"];

  const filteredProducts = products.filter((product) => {
    return (
      (category === "All" || product.category === category) &&
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="app">

      <div className="hero">
        <h1>🛍 Premium Product Store</h1>
        <p>Discover Trending Gadgets with Luxury Experience</p>

        <input
          type="text"
          placeholder="Search Products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={category === cat ? "active" : ""}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="products">
        {filteredProducts.map((product) => (
          <div className="card" key={product.id}>

            <div className="imageBox">
              <img src={product.image} alt={product.name} />
            </div>

            <div className="info">

              <h2>{product.name}</h2>

              <span className="category">{product.category}</span>

              <div className="rating">
                ⭐ {product.rating}
              </div>

              <h3>₹{product.price.toLocaleString()}</h3>

              <div className="buttons">
                <button className="cart">
                  🛒 Add to Cart
                </button>

                <button className="wish">
                  ❤
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default App;