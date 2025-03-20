import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';
import '../styles/ProductDetail.css';

const BookDetail = () => {
  const { id } = useParams(); 
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(new Set());
  const { auth } = useAuth();
  const isAuthenticated = auth?.user != null;

  useEffect(() => {
    // Fetch book details based on ID from API
    fetch(`http://localhost:8080/api/v1/products/product/${id}`)
      .then((response) => response.json())
      .then((data) => setBook(data))
      .catch((error) => console.error('Error fetching book details:', error));
    
    // Fetch user's wishlist if authenticated
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [id, isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/wishlist/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: auth.user.email }),
      });

      if (response.ok) {
        const data = await response.json();
        const wishlistItems = new Set(data.items.map(item => item.productId));
        setWishlist(wishlistItems);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const handleToggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Login required to add items to wishlist');
      return;
    }

    try {
      const method = wishlist.has(productId) ? 'DELETE' : 'POST';
      const response = await fetch(`http://localhost:8080/api/v1/wishlist/${method === 'DELETE' ? 'remove' : 'add'}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: auth.user.email, productId }),
      });

      if (response.ok) {
        if (method === 'DELETE') {
          wishlist.delete(productId);
          toast.success('Removed from wishlist');
        } else {
          wishlist.add(productId);
          toast.success('Added to wishlist');
        }
        setWishlist(new Set(wishlist)); // Update state
      } else {
        toast.error('Failed to update wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Login required to add items to cart');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/v1/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: auth?.user?.email, productId: book.id, quantity }),
      });

      if (response.ok) {
        toast.success('Book added to cart');
      } else {
        toast.error(`Failed to add book to cart for user: ${auth?.user?.email}`);
      }
    } catch (error) {
      console.error('Error adding book to cart:', error);
      toast.error('Failed to add book to cart');
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <Layout showHeader={true} showFooter={false}>
      <section className="py-5">
        <div className="container">
          <div className="row gx-5">
            <aside className="col-lg-6">
              <div className="border rounded-4 mb-3 d-flex justify-content-center image-container">
                <a data-fslightbox="mygalley" className="rounded-4" target="_blank" data-type="image" href={book.image_link}>
                  <img
                    className="rounded-4 fit square-image"
                    src={book.image_link}
                    alt={book.title}
                  />
                </a>
              </div>
            </aside>
            <main className="col-lg-6">
              <div className="ps-lg-3">
                <h4 className="title text-dark">{book.title}</h4>
                <h5>by {book.author}</h5>
                <div className="mb-3">
                  <span className="h5">&#8377; {book.price}</span>
                  <span className="text-muted">/ per copy</span>
                </div>
                <div className="mb-3">
                  <strong>Genre: </strong>{book.genre}
                </div>
                <div className="mb-3">
                  <strong>Published Year: </strong>{book.published_year}
                </div>
                <div className="mb-3">
                  <strong>Language: </strong>{book.language}
                </div>
                <p>{book.description}</p>
                <hr />
                <div className="row mb-4">
                  <div className="col-md-4 col-6 mb-3">
                    <label className="mb-2 d-block">Quantity</label>
                    <div className="input-group mb-3" style={{ width: '170px' }}>
                      <button
                        className="btn btn-white border border-secondary px-3"
                        type="button"
                        id="button-addon1"
                        data-mdb-ripple-color="dark"
                        onClick={handleDecrement}
                      >
                        <FontAwesomeIcon icon="minus" />
                      </button>
                      <input
                        type="text"
                        className="form-control text-center border border-secondary"
                        value={quantity}
                        readOnly
                        aria-label="Quantity"
                        aria-describedby="button-addon1"
                      />
                      <button
                        className="btn btn-white border border-secondary px-3"
                        type="button"
                        id="button-addon2"
                        data-mdb-ripple-color="dark"
                        onClick={handleIncrement}
                      >
                        <FontAwesomeIcon icon="plus" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add to Cart and Wishlist Buttons */}
                <div className="d-flex">
                  <button className="btn btn-primary shadow-0 me-2" onClick={handleAddToCart}>
                    <FontAwesomeIcon icon="shopping-basket" className="me-1" /> Add to cart
                  </button>
                  <button className="btn btn-outline-danger shadow-0" onClick={() => handleToggleWishlist(book.id)}>
                    <FontAwesomeIcon icon={wishlist.has(book.id) ? 'heart' : ['far', 'heart']} className="me-1" /> 
                    {wishlist.has(book.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  </button>
                </div>

                <div className="mt-3">
                  <a href={book.pdf_link} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary">
                    <FontAwesomeIcon icon="file-pdf" className="me-1" /> View PDF
                  </a>
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BookDetail;
