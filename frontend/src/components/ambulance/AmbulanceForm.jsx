import { useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'

function AmbulanceForm({ onSubmit, onCancel, loading = false }) {
  const [ambulanceNumber, setAmbulanceNumber] = useState('')
  const [vehicleNumber, setVehicleNumber] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    onSubmit({
      ambulanceNumber,
      vehicleNumber,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <Input
        label="Ambulance Number"
        value={ambulanceNumber}
        onChange={e => setAmbulanceNumber(e.target.value)}
        placeholder="Example: AMB-004"
        required
      />

      <Input
        label="Vehicle Number"
        value={vehicleNumber}
        onChange={e => setVehicleNumber(e.target.value)}
        placeholder="Example: UP32GH1234"
        required
      />

      <div className="flex justify-end gap-3">
        <Button
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Ambulance'}
        </Button>
      </div>

    </form>
  )
}

export default AmbulanceForm