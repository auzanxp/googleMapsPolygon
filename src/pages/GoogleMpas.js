import React, { useState, useEffect } from 'react';

const GoogleMaps = ({ children }) => {
    // const [mapApiLoaded, setMapApiLoaded] = useState(false);

    // useEffect(() => {
    //     const script = document.createElement('script');
    //     script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GMAP_API_KEY}`;
    //     script.onload = () => {
    //         setMapApiLoaded(true);
    //     };
    //     document.body.appendChild(script);
    // }, []);

    // if (mapApiLoaded) {
    //     return children;
    // } else {
    //     return <div>Loading map...</div>;
    // }
};

export default GoogleMaps;