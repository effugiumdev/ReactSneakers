import Card from "../components/Card";
import React from "react";
import axios from "axios";

function Orders() {
    const [orders, setOrders] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        (async () => {
            try {
                const {data} = await axios.get(`https://669b07c9276e45187d34791a.mockapi.io/orders`)
                setOrders(data.reduce((prev, obj) => [...prev, ...obj.items], []))
                setIsLoading(false)
            } catch (error) {
                alert('Ошибка при запросе заказов')
            }
        })()
    }, [])
    return (
        <div className="content p-40">
            <div className='d-flex align-center justify-between mb-40'>
                <h1>Мои заказы</h1>
            </div>

            <div className="d-flex flex-wrap">
                {(isLoading ? [...Array(12)] : orders).map((item, index) => (
                    <Card
                        key={index}
                        loading={isLoading}
                        {...item}/>
                ))}
            </div>
        </div>
    )
}

export default Orders;