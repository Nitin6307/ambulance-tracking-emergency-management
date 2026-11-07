
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Client } from '@stomp/stompjs'
import L from 'leaflet'

import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const ambulanceIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function MapUpdater({ ambulance }) {
  const map = useMap()

  useEffect(() => {
    if (ambulance?.latitude != null && ambulance?.longitude != null) {
      map.flyTo(
        [ambulance.latitude, ambulance.longitude],
        map.getZoom(),
        { duration: 1 }
      )
    }
  }, [ambulance, map])

  return null
}

function AmbulanceMap({ onAmbulanceUpdate }) {
  const [ambulance, setAmbulance] = useState({
    id: 3,
    ambulanceNumber: 'AMB-003',
    latitude: 26.848,
    longitude: 80.948,
    status: 'ASSIGNED',
  })

  const [connectionStatus, setConnectionStatus] = useState('Connecting...')

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',

      reconnectDelay: 5000,

      onConnect: () => {
        setConnectionStatus('Connected')

        client.subscribe('/topic/ambulances', (message) => {
          const updatedAmbulance = JSON.parse(message.body)

          if (updatedAmbulance.id === 3) {
            setAmbulance(updatedAmbulance)
            onAmbulanceUpdate?.(updatedAmbulance)
          }
        })
      },

      onWebSocketError: (error) => {
        console.error('WebSocket error:', error)
        setConnectionStatus('Connection error')
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message'])
        setConnectionStatus('STOMP error')
      },
    })

    client.activate()

    return () => {
      client.deactivate()
    }
  }, [])


  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapContainer
        center={[ambulance.latitude, ambulance.longitude]}
        zoom={14}
        style={{ height: '100%', width: '100%', borderRadius: '10px' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater ambulance={ambulance} />

        <Marker
          position={[ambulance.latitude, ambulance.longitude]}
          icon={ambulanceIcon}
        >
          <Popup>
            <strong>{ambulance.ambulanceNumber}</strong>
            <br />
            Status: {ambulance.status}
            <br />
            Latitude: {ambulance.latitude}
            <br />
            Longitude: {ambulance.longitude}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )

}

export default AmbulanceMap
