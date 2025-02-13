// src/components/StoreList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StoreList = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStores(); // 컴포넌트 마운트 시 데이터 불러오기
    }, []);

    const fetchStores = async () => {
        try {
            const response = await axios.get('/api/smartMap/load');
            setStores(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStores = async () => {
        try {
            await axios.post('/api/smartMap/save'); // 업데이트 API 호출
            fetchStores(); // 업데이트 후 다시 데이터 불러오기
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Store List</h1>
            <button onClick={handleUpdateStores}>Update Stores</button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Coordinates</th>
                        <th>Phone</th>
                        <th>Theme</th>
                        <th>District</th>
                        <th>New Address</th>
                        <th>Old Address</th>
                        <th>Opening Hours</th>
                        <th>Img</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.map((store) => (
                        <tr key={store.smartMapId}>
                            <td>{store.smartMapId}</td>
                            <td>{store.name}</td>
                            <td>{store.coordX}, {store.coordY}</td>
                            <td>{store.telNo}</td>
                            <td>{store.themeName}</td>
                            <td>{store.guName}</td>
                            <td>{store.addrNew}</td>
                            <td>{store.addrOld}</td>
                            <td>{store.openingHours}</td>
                            <td>{store.imgUrl}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StoreList;