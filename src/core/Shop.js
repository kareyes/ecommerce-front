import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import Card from "./Card";
import { getCategories, getFilterProducts } from "./apiCore";
import Checkbox from "./Checkbox";
import { prices } from "./fixedPrices";
import RadioBox from "./RadioBox";

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState([]);
  const [limit, setLimit] = useState(6);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0);
  const [filterResults, setFilterResults] = useState([]);
  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] },
  });
  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  const loadFilteredResults = (newFilters) => {
    console.log(newFilters);
    getFilterProducts(skip, limit, newFilters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilterResults(data.data);
        setSize(data.size)
        setSkip(0)
      }
    });
  };
  const loadMore = () => {
    //console.log(newFilters);

    let toSkip = skip + limit;

    getFilterProducts(toSkip, limit, myFilters.filters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilterResults([...filterResults, ...data.data]);
        setSize(data.size)
        setSkip(toSkip)
      }
    });
  };

  const loadMoreButton = () => {
      return (
          size > 0 && size >= limit && (
              <button onClick={loadMore} className="btn btn-warning mb-5">Load More</button>
              
          )
      )
  }


  const handleFilters = (filters, filterBy) => {
    //console.log(filters, filterBy);
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;

    if (filterBy == "price") {
      let priceValues = handlePrice(filters);
      newFilters.filters[filterBy] = priceValues;
    }
    loadFilteredResults(myFilters.filters);
    setMyFilters(newFilters);
  };
  const handlePrice = (value) => {
    const data = prices;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value)) {
        array = data[key].array;
      }
    }
    return array;
  };
  useEffect(() => {
    init();
    loadFilteredResults(skip, limit, myFilters.filters);
  }, []);

  return (
    <Layout
      title="Shop Page"
      description="Search and find books of your choice"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-4">
          <h4> Filter by categories </h4>
          <ul>
            <Checkbox
              categories={categories}
              handleFilters={(filters) => handleFilters(filters, "category")}
            />
          </ul>

          <h4> Filter by price range </h4>
          <div>
            <RadioBox
              prices={prices}
              handleFilters={(filters) => handleFilters(filters, "price")}
            />
          </div>
        </div>
        <div className="col-8">
          <h2 className="mb-4"> Products</h2>
          <div className="row">
            {filterResults.map((product, i) => (
              <div key={i} className="col-4 mb-3">
                <Card product={product} />
              </div>
            ))}
          </div>
          <hr/>
          {loadMoreButton()}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
