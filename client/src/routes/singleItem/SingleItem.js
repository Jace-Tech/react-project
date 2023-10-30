import React, { useEffect, useLayoutEffect, useState } from "react";
import GoBackBtn from "./GoBackBtn";
import AddToCartButton from "../cart/AddToCartButton";
// import Attribute from "../menu/Attribute";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// import { allProductsData } from "../../data/AllProductsData.js";

const SingleItem = ({ handleAddProduct, handleRemoveProduct }) => {
  const [singleProduct, setSingleProduct] = useState({});
  // const [selectedAttributes, setSelectedAttributes] = useState([]);
  // const [targetAttribute, setTargetAttribute] = useState('');
  const { name } = useParams()
  const products = useSelector(state => state.contentStore.products)


  useEffect(() => {
    document.title = `${singleProduct.name}`;
    const item = products.find((item) => item._id === name)
    setSingleProduct(item);
  }, []);


  // const handleSelectedAttributes = (attributeId, attributeValue) => {
  //   setTargetAttribute(attributeValue);
  //   const newSelectedAttribute = { attributeId, attributeValue };
  //   setSelectedAttributes(prevAttributes => {
  //     const existingAttributeIndex = prevAttributes.findIndex(
  //       attribute => attribute.attributeId === newSelectedAttribute.attributeId
  //     );
  //     if (existingAttributeIndex !== -1) {
  //       const updatedAttributes = [...prevAttributes];
  //       updatedAttributes[existingAttributeIndex] = { ...newSelectedAttribute };
  //       return updatedAttributes;
  //     } else {
  //       return [...prevAttributes, newSelectedAttribute];
  //     }
  //   });
  // };


  return (
    <main className="single-item-container">
      <GoBackBtn />
      <article className="single-item flex-container flex-column txt-white">
        <img
          src={singleProduct?.images?.[0]}
          alt={`${singleProduct?.name}`}
        />
        <section className="single-item-info">
          <section className="single-item-title">
            <h2>{singleProduct?.name}</h2>
            <p>{singleProduct?.description}</p>
          </section>
          
          <section className="price">
            {singleProduct.salePrice ?
              <section className="sale-pricing">
                <p className="price-num-before"><span>$</span>{singleProduct?.salePrice}</p>
                <p className="price-num"><span>$</span>{singleProduct?.regularPrice}</p>
              </section>
              :
              <p className="price-num"><span>$</span>{singleProduct?.regularPrice}</p>
            }
            <AddToCartButton
              handleAddProduct={handleAddProduct}
              singleProduct={singleProduct}
            />
          </section>
        </section>
      </article>
    </main>
  );
}


export default SingleItem;