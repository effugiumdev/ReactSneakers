import React from "react";
import {Route, Routes} from "react-router-dom";
import axios from "axios";
import AppContext from "./context";

import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Orders from "./pages/Orders";

function App() {
    const [items, setItems] = React.useState([])
    const [cartItems, setCartItems] = React.useState([])
    const [favorites, setFavorites] = React.useState([])
    const [searchValue, setSearchValue] = React.useState('')
    const [cartOpened, setCartOpened] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true)


    React.useEffect(() => {
        async function fetchData() {

            try {
                const [cartResponse,
                    favoritesResponse,
                    itemsResponse] = await Promise.all([
                    await axios.get(`https://66943e8cc6be000fa07e75ed.mockapi.io/cart`),
                    await axios.get(`https://669b07c9276e45187d34791a.mockapi.io/favorite`),
                    await axios.get(`https://66943e8cc6be000fa07e75ed.mockapi.io/items`)])

                setIsLoading(false)
                setCartItems(cartResponse.data)
                setFavorites(favoritesResponse.data)
                setItems(itemsResponse.data)
            } catch (error) {
                alert('Ошибка при запросе данных :(')
                console.error(error)

            }
        }

        fetchData()
    }, [])

    const onAddToCart = async (obj) => {
        try {
            const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id))
            if (findItem) {
                setCartItems((prev) => prev.filter((item) => Number(item.parentId) !== Number(obj.id)))
                await axios.delete(`https://66943e8cc6be000fa07e75ed.mockapi.io/cart/${findItem.id}`);
            } else {
                setCartItems(prev => [...prev, obj])
                const {data} = await axios.post(`https://66943e8cc6be000fa07e75ed.mockapi.io/cart`, obj);
                setCartItems(prev => prev.map((item) => {
                    if (item.parentId === data.parentId) {
                        return {
                            ...item,
                            id: data.id
                        }
                    }
                    return item
                }))
            }
        } catch (error) {
            alert('Ошибка при добавлении данных в корзину')
            console.error(error)

        }
    }

    const onRemoveItem = (id) => {
        try {
            axios.delete(`https://66943e8cc6be000fa07e75ed.mockapi.io/cart/${id}`);
            setCartItems(prev => prev.filter((item) => Number(item.id) !== Number(id)))
        } catch (error) {
            alert('Ошибка при удалении записи из корзины')
            console.error(error)
        }
    }

    const onAddToFavorite = async (obj) => {
        try {
            if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
                axios.delete(`https://669b07c9276e45187d34791a.mockapi.io/favorite/${obj.id}`)
                setFavorites((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)))
            } else {
                const {data} = await axios.post(`https://669b07c9276e45187d34791a.mockapi.io/favorite`, obj);
                setFavorites(prev => [...prev, data])
            }
        } catch (error) {
            alert('Не удалось добавить в избранное')
            console.error(error)

        }
    }

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value)
    }

    const isItemAdded = (id) => {
        return cartItems.some((obj) => Number(obj.parentId) === Number(id))
    }

    return (
        <AppContext.Provider value={{
            items,
            cartItems,
            favorites,
            isItemAdded,
            onAddToFavorite,
            onAddToCart,
            setCartOpened,
            setCartItems
        }}>
            <div className="wrapper clear">
                <Drawer items={cartItems}
                        onClose={() => setCartOpened(false)}
                        onRemove={onRemoveItem}
                        opened={cartOpened}/>

                <Header onClickCart={() => setCartOpened(true)}/>

                <Routes>
                    <Route exact path='/'
                           element={<Home
                               items={items}
                               cartItems={cartItems}
                               searchValue={searchValue}
                               setSearchValue={setSearchValue}
                               onChangeSearchInput={onChangeSearchInput}
                               onAddToFavorite={onAddToFavorite}
                               onAddToCart={onAddToCart}
                               isLoading={isLoading}
                           />}/>
                    <Route path='/favorites' element = {<Favorites/>} />
                    <Route path="/orders" element = {<Orders/>} />
                </Routes>
            </div>
        </AppContext.Provider>
    );
}

export default App;
