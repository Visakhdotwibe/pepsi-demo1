"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import ProductSection from "./product-section";


export default function ProductListHome() {


    return (
        <section className="product-list-wrapp">
            <div className="container">
                <h3>Our Products</h3>
                
                <ProductSection/>

            </div>
        </section>
    );
}