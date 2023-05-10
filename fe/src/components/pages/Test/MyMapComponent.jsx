import MapGL, { Marker, NavigationControl, GeolocateControl } from '@goongmaps/goong-map-react';
import { useCallback, useRef, useState } from 'react';
import ControlPanel from './control-panel';
import Pin from './pin';

const navStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '10px',
};

export default function MyMapComponent() {
    const [viewport, setViewport] = useState({
        width: '100%',
        height: 600,
        latitude: 21.05226,
        longitude: 105.91333,
        zoom: 8,
    });

    const [marker, setMarker] = useState({
        latitude: 21.05226,
        longitude: 105.91333,
    });
    const [events, logEvents] = useState({});

    const onMarkerDragStart = useCallback((event) => {
        logEvents((_events) => ({ ..._events, onDragStart: event.lngLat }));
    }, []);

    const onMarkerDrag = useCallback((event) => {
        logEvents((_events) => ({ ..._events, onDrag: event.lngLat }));
    }, []);

    const onMarkerDragEnd = useCallback((event) => {
        logEvents((_events) => ({ ..._events, onDragEnd: event.lngLat }));
        setMarker({
            longitude: event.lngLat[0],
            latitude: event.lngLat[1],
        });
    }, []);

    return (
        <>
            <MapGL
                {...viewport}
                onViewportChange={(nextViewport) => setViewport(nextViewport)}
                goongApiAccessToken="MgcGQMRDTmBpKwgwPNr0W5BMFck9jtA3L4frqj3w"
            >
                <GeolocateControl
                    // auto
                    onViewportChange={(nextViewport) => setViewport(nextViewport)}
                    goongApiAccessToken="MgcGQMRDTmBpKwgwPNr0W5BMFck9jtA3L4frqj3w"
                />
                {/* <Geocoder
                    mapRef={this.mapRef}
                    onViewportChange={(nextViewport) => setViewport(nextViewport)}
                    goongApiAccessToken="MgcGQMRDTmBpKwgwPNr0W5BMFck9jtA3L4frqj3w"
                /> */}
                <Marker
                    longitude={marker.longitude}
                    latitude={marker.latitude}
                    offsetTop={-20}
                    offsetLeft={-10}
                    draggable
                    onDragStart={onMarkerDragStart}
                    onDrag={onMarkerDrag}
                    onDragEnd={onMarkerDragEnd}
                >
                    <Pin size={30} />
                </Marker>
                <div className="nav" style={navStyle}>
                    <NavigationControl />
                </div>
            </MapGL>
            <ControlPanel events={events} />
        </>
    );
}
// function MyMapComponent() {
//     const [viewport, setViewport] = useState({
//         width: 400,
//         height: 400,
//         latitude: 37.7577,
//         longitude: -122.4376,
//         zoom: 8,
//     });

//     return <ReactMapGL {...viewport}       goongApiAccessToken="hXqN5VLZ8jK6CPWKhe5ygeEUdfxA5E68ZCj3yaUN" onViewportChange={(nextViewport)  => setViewport(nextViewport)} />;
// }
// export default MyMapComponent;

const aaa = [
    {
        address_components: [
            {
                long_name: 'Hồ Chí Minh',
                short_name: 'Hồ Chí Minh',
            },
            {
                long_name: 'Việt Nam',
                short_name: 'Việt Nam',
            },
        ],
        formatted_address: 'Hồ Chí Minh, Việt Nam',
        geometry: {
            location: {
                lat: 10.776553100000058,
                lng: 106.70105355500004,
            },
            boundary: null,
        },
        place_id:
            'CHgZQrwokbZ15rjexqG6F6WELQK2bcp6eStszOa-CCJ59g1QEtquB9Hq-MxOFqubhf4duLK5ip8Rg2moSrVCa1HuuSD2rQJ3aeb1LX51tnZV4elCHq3qN9AsLWHydIObd',
        reference:
            'CHgZQrwokbZ15rjexqG6F6WELQK2bcp6eStszOa-CCJ59g1QEtquB9Hq-MxOFqubhf4duLK5ip8Rg2moSrVCa1HuuSD2rQJ3aeb1LX51tnZV4elCHq3qN9AsLWHydIObd',
        plus_code: {
            compound_code: '',
            global_code: '',
        },
        compound: {
            district: 'Quận 1',
            commune: 'Bến Nghé',
            province: 'Hồ Chí Minh',
        },
        types: ['commune'],
        name: 'Thành phố Hồ Chí Minh',
        address: 'Việt Nam',
    },
    {
        address_components: [
            {
                long_name: 'Thành phố Hồ Chí Minh',
                short_name: 'Thành phố Hồ Chí Minh',
            },
            {
                long_name: 'Việt Nam',
                short_name: 'Việt Nam',
            },
        ],
        formatted_address: 'Thành phố Hồ Chí Minh, Việt Nam',
        geometry: {
            location: {
                lat: 10.8230989,
                lng: 106.6296638,
            },
            boundary: null,
        },
        place_id:
            'V7iIh6IpLYt9pV11qV1Z30S0ORajWVGWRKc7FJV3mOtEi2O9zpl2YyTHQM0OlWKr8cZxjApFYlJpCkFkPpliplnKlMhW-dZTncLRCVpRklP1xjlHvogKElHOmWQKUiwPU',
        reference:
            'V7iIh6IpLYt9pV11qV1Z30S0ORajWVGWRKc7FJV3mOtEi2O9zpl2YyTHQM0OlWKr8cZxjApFYlJpCkFkPpliplnKlMhW-dZTncLRCVpRklP1xjlHvogKElHOmWQKUiwPU',
        plus_code: {
            compound_code: '',
            global_code: '',
        },
        compound: {
            district: 'Tân Bình',
            commune: 'Phường 15',
            province: 'Hồ Chí Minh',
        },
        types: ['commune'],
        name: 'Thành phố Hồ Chí Minh',
        address: 'Việt Nam',
    },
    {
        address_components: [
            {
                long_name: 'HCM',
                short_name: 'HCM',
            },
            {
                long_name: 'Cao Thắng',
                short_name: 'Cao Thắng',
            },
            {
                long_name: 'Lương Sơn',
                short_name: 'Lương Sơn',
            },
            {
                long_name: 'Hòa Bình',
                short_name: 'Hòa Bình',
            },
        ],
        formatted_address: 'HCM, Cao Thắng, Lương Sơn, Hòa Bình',
        geometry: {
            location: {
                lat: 20.6720878,
                lng: 105.6702156,
            },
            boundary: null,
        },
        place_id:
            'qIaEgWa3xVtinkwdRGWjTGa9yCaoSolEa62JJYEVp25QocZDOHCv0WDWfTLGtFr_yZTVuGrBjgd5gj0whqxS7nlC9VDirTP-dZaFgQ4FXgehkm3EXtxeRgWazTDyBFvrB',
        reference:
            'qIaEgWa3xVtinkwdRGWjTGa9yCaoSolEa62JJYEVp25QocZDOHCv0WDWfTLGtFr_yZTVuGrBjgd5gj0whqxS7nlC9VDirTP-dZaFgQ4FXgehkm3EXtxeRgWazTDyBFvrB',
        plus_code: {
            compound_code: '+BLVTZ2 Cao Thắng, Lương Sơn, Hòa Bình',
            global_code: '1TE4F+BLVTZ2',
        },
        compound: {
            district: 'Lương Sơn',
            commune: 'Thanh Cao',
            province: 'Hòa Bình',
        },
        types: [],
        name: 'HCM',
        address: 'Cao Thắng, Lương Sơn, Hòa Bình',
    },
];
