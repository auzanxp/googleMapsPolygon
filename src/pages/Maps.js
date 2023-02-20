import React, { useState, useEffect } from 'react';

const Map = () => {
    const [map, setMap] = useState(null);
    const [polygons, setPolygons] = useState([]);
    const [selectedPolygon, setSelectedPolygon] = useState(null);

    useEffect(() => {
        // Load the Google Maps JavaScript API script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GMAP_API_KEY}&callback=initMap`;
        script.defer = true;
        script.async = true;
        window.initMap = () => {
            const newMap = new window.google.maps.Map(document.getElementById('map'), {
                center: { lat: 35.72123671702373, lng: 139.7315125062222 },
                zoom: 14,
            });
            setMap(newMap);
        };
        document.body.appendChild(script);

        const fetchPolygons = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/trial`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: process.env.REACT_APP_TOKEN_KEY
                },
                body: JSON.stringify({
                    lat: 35.72123671702373,
                    lng: 139.7315125062222,
                }),
            });
            const data = await response.json();
            const coordinates = data.value.features
            coordinates.forEach((feature) => {
                const geometry = feature.geometry.coordinates[0];
                console.log(geometry);
                setPolygons(geometry)
            });
        };
        fetchPolygons();
    }, []);

    useEffect(() => {
        // Render polygons on the map
        if (map && polygons) {
            polygons.forEach((item) => {
                const polygonObj = new window.google.maps.Polygon({
                    paths: item.map(coord => ({ lat: coord[1], lng: coord[0] })),
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                });
                console.log(item)
                polygonObj.setMap(map);

                // Add click event listener to the polygon
                window.google.maps.event.addListener(polygonObj, 'click', () => {
                    if (selectedPolygon) {
                        selectedPolygon.setOptions({
                            strokeColor: '#FF0000',
                            fillColor: '#FF0000',
                        });
                    }
                    setSelectedPolygon(polygonObj);
                    polygonObj.setOptions({
                        strokeColor: '#00FF00',
                        fillColor: '#00FF00',
                    });
                });
            });
        }
    }, [map, polygons, selectedPolygon]);

    return <div id="map" style={{ height: '100vh', width: '100%' }} />;
};

export default Map;
