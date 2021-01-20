import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
// import products from "../products";
import axios from "axios";

const HomeScreen = () => {
  // [Fetching data from backend in a component] 1. useHooks to generate state in function component
  const [products, setProducts] = useState([]);

  // [Fetching data from backend in a component] 2. useEffect hook + axios to get fetch data
  useEffect(() => {
    const fetchProducts = async () => {
      // instead of saving it to a variable destructure the data directly here
      const { data } = await axios.get("/api/products");

      setProducts(data);
    };

    fetchProducts();
  }, []);

  // [Fetching data from backend in a component] 3. will error bec it is trying to fetch it from localhost 3000 instead of our backend local host5000 - ADD PROXY in json file @frontend   "proxy": "http://127.0.0.1:5000",

  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} ld={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;
