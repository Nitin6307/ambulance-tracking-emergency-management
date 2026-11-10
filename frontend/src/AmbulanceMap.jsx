
import { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from 'react-leaflet'
import { Client } from '@stomp/stompjs'
import L from 'leaflet'

import ambulanceApi from './api/ambulanceApi'

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

function MapUpdater({ ambulances }) {
  const map = useMap()
  const [hasFitted, setHasFitted] = useState(false)

  useEffect(() => {
    if (hasFitted) return

    const locatedAmbulances = ambulances.filter(
      ambulance =>
        ambulance.latitude != null &&
        ambulance.longitude != null
    )

    if (locatedAmbulances.length > 0) {
      const bounds = L.latLngBounds(
        locatedAmbulances.map(ambulance => [
          Number(ambulance.latitude),
          Number(ambulance.longitude)
        ])
      )

      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
      setHasFitted(true)
    }
  }, [ambulances, map, hasFitted])

  return null
}

function AmbulanceMap({ onAmbulanceUpdate, ambulanceId = null }) {
  const [ambulances, setAmbulances] = useState([])
  const [connectionStatus, setConnectionStatus] =
    useState('Connecting...')

  const [loading, setLoading] = useState(true)

  // Fetch all ambulances from backend
  useEffect(() => {
    ambulanceApi.getAll()
      .then(response => {
        const data = response.data

        if (ambulanceId !== null) {
          setAmbulances(
            data.filter(item => Number(item.id) === Number(ambulanceId))
          )
        } else {
          setAmbulances(data)
        }
      })
      .catch(error => {
        console.error('Failed to fetch ambulances:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [ambulanceId])

  // Connect to WebSocket for real-time location updates
  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',

      reconnectDelay: 5000,

      onConnect: () => {
        console.log('Ambulance WebSocket connected')
        setConnectionStatus('Connected')

        client.subscribe('/topic/ambulances', (message) => {
          try {
            const updatedAmbulance = JSON.parse(message.body)

            if (
              ambulanceId !== null &&
              Number(updatedAmbulance.id) !== Number(ambulanceId)
            ) {
              return
            }

            setAmbulances(previousAmbulances => {
              const exists = previousAmbulances.some(
                ambulance => Number(ambulance.id) === Number(updatedAmbulance.id)
              )

              if (exists) {
                return previousAmbulances.map(ambulance =>
                  Number(ambulance.id) === Number(updatedAmbulance.id)
                    ? { ...ambulance, ...updatedAmbulance }
                    : ambulance
                )
              }

              return [...previousAmbulances, updatedAmbulance]
            })

            onAmbulanceUpdate?.(updatedAmbulance)

          } catch (error) {
            console.error('Invalid ambulance update:', error)
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

      onDisconnect: () => {
        setConnectionStatus('Disconnected')
      }
    })

    client.activate()

    return () => {
      client.deactivate()
    }
  }, [ambulanceId])

  const locatedAmbulances = ambulances.filter(
    ambulance =>
      ambulance.latitude != null &&
      ambulance.longitude != null
  )

  return (
    <div style={{ width: '100%', height: '100%' }}>

      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-2 text-sm">

        <span className="text-slate-300">
          Total Ambulances: {ambulances.length}
        </span>

        <span className="text-slate-300">
          Located: {locatedAmbulances.length}
        </span>

        <span className={
          connectionStatus === 'Connected'
            ? 'text-green-400'
            : 'text-yellow-400'
        }>
          ● {connectionStatus}
        </span>

      </div>

      {loading && (
        <p className="p-2 text-sm text-slate-300">
          Loading ambulance locations...
        </p>
      )}

      <MapContainer
        center={[26.8467, 80.9462]}
        zoom={12}
        style={{
          height: 'calc(100% - 30px)',
          width: '100%',
          borderRadius: '10px'
        }}
      >

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater ambulances={ambulances} />

        {locatedAmbulances.map(ambulance => (

          <Marker
            key={ambulance.id}
            position={[
              Number(ambulance.latitude),
              Number(ambulance.longitude)
            ]}
            icon={ambulanceIcon}
          >

            <Popup>

              <strong>{ambulance.ambulanceNumber}</strong>

              <br />

              Status: {ambulance.status}

              <br />

              Vehicle: {ambulance.vehicleNumber}

              <br />

              Latitude: {ambulance.latitude}

              <br />

              Longitude: {ambulance.longitude}

            </Popup>

          </Marker>

        ))}

      </MapContainer>

    </div>
  )
}

export default AmbulanceMap
