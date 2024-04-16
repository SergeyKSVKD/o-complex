'use client'

import styles from "./page.module.scss";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store/store';
import React, { memo, useEffect, useState } from "react";
import { getComments } from "./store/CommentsSlice";
import { convertHtmlToReact } from '@hedgedoc/html-to-react';
import { changePage, getProducts } from "./store/ProductsSlice";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useScrollPosition } from "./helpers/useScroll";
import Preloader from "./components/preloader/Preloader";
import type { ProductType } from "./store/ProductsSlice";
import { FaShoppingBasket } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const position = useScrollPosition()
  const commentsState = useSelector((state: RootState) => state.commentsState)
  const productsState = useSelector((state: RootState) => state.productsState.products)
  const activePage = useSelector((state: RootState) => state.productsState.page)
  const total = useSelector((state: RootState) => state.productsState.total)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [isStartLoading, setIsStartLoading] = useState(false)
  const [productsList, setProductsList] = useState<any>([])

  const [isBasketVisible, setIsBasketVisible] = useState(false)
  const [number, setNumber] = useState('')
  const handleInput = ({ target: { value } }) => setNumber(value)
  const [cart, setCart] = useState<any>([])

  useEffect(() => {
    dispatch(getComments())
    dispatch(getProducts({}))
    setTimeout(() => {
      setLoadingProducts(false)
    }, 2000)
  }, [])

  useEffect(() => {
    setProductsList([...productsList, ...productsState])
  }, [productsState])

  useEffect(() => {
    const main = document.querySelector('main')

    if (!loadingProducts && main && main.scrollHeight - position < 3000) {
      setIsStartLoading(true)
    }
  }, [position])

  useEffect(() => {
    if (productsList.length < total) {
      if (!loadingProducts && isStartLoading) {
        const page = activePage + 1
        setLoadingProducts(true)
        dispatch(changePage(page))
        dispatch(getProducts({ page }))
      }
      setTimeout(() => {
        setLoadingProducts(false)
        setIsStartLoading(false)
      }, 2000)
    }
    else return
  }, [isStartLoading])

  const NumberInput = ({ number, handleInput }) => {
    return (
      <input
        className={styles.phone}
        autoFocus
        placeholder='78005553535'
        pattern="/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/"
        value={number}
        onChange={handleInput}
        required
      />
    )
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <span data-text='O-COMPLEX' className={styles.title}>O-COMPLEX</span>
        <FaShoppingBasket size={48}
          onClick={() => setIsBasketVisible(!isBasketVisible)}
        />
      </header>
      {isBasketVisible &&
        <div className={styles.blur} onClick={() => {
          setIsBasketVisible(false)
        }} />}
      {isBasketVisible && <div className={styles.basket_card}>
        <IoClose size={48} className={styles.close} onClick={() => {
          setIsBasketVisible(false)
        }} />
        <p>Добавленные товары</p>
        <div  className={styles.productsInCart}>
          {cart && cart.map((item) => {
            return <div key={item.id} className={styles.productInCart}>
              <p>Товар #{item.id}</p>
              <p>x{item.quantity}</p>
              <p>{item.totalPrice} ₽</p>
            </div>
          })}
        </div>
        <div className={styles.order_container}>
          <NumberInput number={number} handleInput={handleInput} />
          <button className={styles.order_btn}
            onClick={async () => {
              if (number && cart.length > 0) {
                const body = {
                  phone: number,
                  cart,
                }

                const res = await fetch(`http://o-complex.com:1337/order`, {
                  method: "POST",
                  body: JSON.stringify(body),
                  headers: {
                    "Content-type": "application/json",
                  },
                })
                const data = await res.json()

                if (data !== undefined && data.success === 1) {
                  setNumber('')
                  setCart([]) // сбросить quantity
                  alert('Заказ добавлен в обработку')
                }
                else {
                  // throw new Error(`${data.error}`)
                  alert(`${data.error}`)
                }
                return
              }
              if (!number || cart.length === 0) {
                alert('Заполните все поля')
              }
            }}
          >Заказать</button>
        </div>
      </div>}
      <div className={styles.shape} />
      <div className={styles.shape2} />
      <div className={styles.shape3} />

      <div className={styles.cards}>
        {
          commentsState.loading === 'loading' || commentsState.comments.length === 0 && <div className={styles.card_preload}>
            <Preloader />
          </div>
        }
        {
          commentsState.loading !== 'loading' && commentsState.comments?.map((comment, index) => {
            return <div className={styles.card} key={index}>
              <p className={styles.card_id}>{comment.id}</p>
              <div className={styles.card_content}>{convertHtmlToReact(comment.text)}</div>
            </div>
          })
        }
      </div>

      <div className={styles.products_container}>
        {
          productsList.map((product: ProductType, index: number) => {
            return <div className={styles.product_card}
              key={index}
              onClick={(e) => {
                router.push(`/${product.id}`)
              }}
            >
              <Image style={{
                borderRadius: 15,
              }}
                width={281}
                height={366}
                src={product.image_url}
                alt={product.title}
              />
              <p className={styles.product_title}>{product.title}</p>
              <p className={styles.product_description}>{product.description.length > 350 ?
                product.description.slice(0, 350) + ' ...' :
                product.description
              }</p>
              <p className={styles.product_price}>{product.price} ₽</p>
              {
                product.quantity === 0 ?
                  <button className={styles.btn} data-id={product.id}
                    onClick={(e: any) => {
                      e.stopPropagation()
                      e.preventDefault()
                      const deep = structuredClone(productsList)
                      const product = deep.find((item: ProductType) => item.id === Number(e.target.dataset.id))
                      product.quantity = product.quantity + 1
                      const order = { name: product.title, id: product.id, quantity: product.quantity, price: product.price, totalPrice: product.price * product.quantity }
                      setCart([...cart, order])
                      setProductsList(deep)
                    }}
                  >Купить</button>
                  :
                  <div onClick={e => {
                    e.stopPropagation()
                    e.preventDefault()
                  }}
                    className={styles.quantity_container}
                  >
                    <button className={styles.quantity_btn}
                      data-id={product.id}
                      onClick={(e: any) => {
                        e.stopPropagation()
                        e.preventDefault()
                        const deep = structuredClone(productsList)
                        const product = deep.find((item: ProductType) => item.id === Number(e.target.dataset.id))
                        product.quantity = product.quantity - 1
                        setProductsList(deep)
                        const deepCart = structuredClone(cart)
                        let filtered = []
                        deepCart.map((item: any) => {
                          if (item.id === Number(e.target.dataset.id)) {
                            if (item.quantity !== 0) {
                              item.quantity = item.quantity - 1
                              item.totalPrice = item.quantity * item.price
                            }
                            if (item.quantity === 0) {
                              filtered = deepCart.filter(item => item.id !== Number(e.target.dataset.id))
                            }
                          }
                        })
                        !filtered ? setCart([...deepCart]) : setCart([...filtered])
                      }}
                    >-</button>
                    <button className={styles.quantity}>{product.quantity}</button>
                    <button className={styles.quantity_btn}
                      data-id={product.id}
                      onClick={(e: any) => {
                        e.stopPropagation()
                        e.preventDefault()
                        const deep = structuredClone(productsList)
                        const product = deep.find((item: ProductType) => item.id === Number(e.target.dataset.id))
                        product.quantity = product.quantity + 1
                        setProductsList(deep)
                        const deepCart = structuredClone(cart)
                        deepCart.map((item: any) => {
                          if (item.id === Number(e.target.dataset.id)) {
                            item.quantity = item.quantity + 1
                            item.totalPrice = item.quantity * item.price
                          }

                        })
                        setCart([...deepCart])
                      }}
                    >+</button>
                  </div>
              }
            </div>
          })
        }
      </div>

    </main >
  )
}

export default Home