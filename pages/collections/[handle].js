import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';

function Collection() {
  const router = useRouter()
  const { handle } = router.query

  // Define state variables to keep track of the products and the current page number
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products when the page is loaded or when the current page number changes
  useEffect(() => {
    if (handle) {
      fetchProducts(currentPage);
    }
  }, [handle, currentPage]);

  // Fetch products from the endpoint and update the products state
  const fetchProducts = async (page) => {
    const response = await fetch(`https://summersalt.com/collections/${handle}/products.json?page=${page}&limit=10`);
    const data = await response.json();
    setProducts((prevProducts) => [...prevProducts, ...data.products]);
  };

  // Handle the scroll event and load more products when the user has scrolled near the bottom of the page
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Add a scroll event listener when the component is mounted and remove it when the component is unmounted
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function getPriceRange(variants) {
    let minPrice = variants[0].price;
    let maxPrice = variants[0].price;

    for (let i = 1; i < variants.length; i++) {
      if (variants[i].price < minPrice) {
        minPrice = variants[i].price;
      }
      if (variants[i].price > maxPrice) {
        maxPrice = variants[i].price;
      }
    }

    if (minPrice === maxPrice) {
      return `$${minPrice}`;
    } else {
      return `$${minPrice} - $${maxPrice}`;
    }
  }

  if (!router.isReady) {
    return <div>Loading...</div>
  }
  // Render the list of products, displaying the title and first image of each product and linking to its detail page
  return (
    <>
      <div className="collection-title">SUMMERSALT</div>
      <div className="product-list">
        {products.map((product) => (
          <div className="product-item" key={product.id}>
            <a href={`/products/${product.handle}`}>
              <div className="product-image" style={{backgroundImage: `url(${product.images[0].src})`}}></div>
              <div className="product-details">
                <div className="product-title">{product.title}</div>
                <div className="product-price">{getPriceRange(product.variants)}</div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </>
  );
}

export default Collection;
