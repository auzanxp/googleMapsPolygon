import React, { useState, useEffect } from 'react';

const Map = () => {
    const [map, setMap] = useState(null);
    const [polygons, setPolygons] = useState([]);

    useEffect(() => {
        // Load the Google Maps API
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
            try {
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
                let geoList = [];
                coordinates.forEach((feature) => {
                    const geometry = feature.geometry.coordinates[0];
                    geoList.push(geometry)
                });
                setPolygons(geoList)
            } catch (error) {
                console.error(error);
            }
        };
        fetchPolygons();
    }, []);

    useEffect(() => {
        // Render polygons on the map
        if (map && polygons) {
            const selectedPolygons = [];
            polygons.forEach((item) => {
                const polygonObj = new window.google.maps.Polygon({
                    paths: item.map(coord => coord.map(v => ({lat: v[1], lng: v[0]}))),
                    strokeColor: '#0099ff',
                    strokeOpacity: 0.8,
                    zIndex: 1,
                    strokeWeight: 1,
                    fillColor: '#B6D5E0',
                    fillOpacity: 0.3,
                });
                polygonObj.setMap(map);
    
                // Add click event listener to the polygon
                window.google.maps.event.addListener(polygonObj, 'click', () => {
                    if (selectedPolygons.includes(polygonObj)) {
                        // Remove polygon from selectedPolygons and set color back to beginning
                        selectedPolygons.splice(selectedPolygons.indexOf(polygonObj), 1);
                        polygonObj.setOptions({
                            strokeColor: '#0099ff',
                            fillColor: '#B6D5E0',
                        });
                    } else {
                        // Add polygon to selectedPolygons  
                        selectedPolygons.push(polygonObj);
                        polygonObj.setOptions({
                            strokeColor: '#FF0000',
                            fillColor: '#FF0000',
                        });
                    }
    
                    // Loop through selectedPolygons
                    selectedPolygons.forEach((selected) => {
                        selected.setOptions({
                            strokeColor: '#FF0000',
                            fillColor: '#FF0000',
                        });
                    });
                });
            });
        }
    }, [map, polygons]);
    
    return <div id="map" style={{ height: '100vh', width: '100%' }} />;
};

export default Map;
