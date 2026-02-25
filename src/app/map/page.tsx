'use client'

import { useState } from 'react'
import { MapPin, Users, Search, Navigation, Building2, Layers } from 'lucide-react'

const buildings = [
  { id: 'nr', name: 'Nalanda Complex', floors: 3 },
  { id: 'rk', name: 'RK Hall', floors: 2 },
  { id: 'cc', name: 'Computer Center', floors: 4 },
  { id: 'me', name: 'Mechanical Building', floors: 3 },
  { id: 'ee', name: 'Electrical Building', floors: 4 },
]

const classrooms = [
  {
    id: 1,
    name: 'NR321',
    building: 'Nalanda Complex',
    floor: 3,
    capacity: 60,
    type: 'Lecture Hall',
    facilities: ['Projector', 'AC', 'Whiteboard'],
    status: 'available',
  },
  {
    id: 2,
    name: 'NR322',
    building: 'Nalanda Complex',
    floor: 3,
    capacity: 80,
    type: 'Lecture Hall',
    facilities: ['Projector', 'AC', 'Whiteboard', 'Mic'],
    status: 'occupied',
  },
  {
    id: 3,
    name: 'NR323',
    building: 'Nalanda Complex',
    floor: 3,
    capacity: 60,
    type: 'Lecture Hall',
    facilities: ['Projector', 'Whiteboard'],
    status: 'available',
  },
  {
    id: 4,
    name: 'NR324',
    building: 'Nalanda Complex',
    floor: 3,
    capacity: 40,
    type: 'Lab',
    facilities: ['Computers', 'AC', 'Projector'],
    status: 'available',
  },
]

export default function MapPage() {
  const [selectedBuilding, setSelectedBuilding] = useState('nr')
  const [selectedFloor, setSelectedFloor] = useState(3)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRoom, setSelectedRoom] = useState<typeof classrooms[0] | null>(
    classrooms[0]
  )

  const currentBuilding = buildings.find((b) => b.id === selectedBuilding)
  const currentRooms = classrooms.filter(
    (room) =>
      room.building === currentBuilding?.name &&
      room.floor === selectedFloor &&
      (searchQuery === '' ||
        room.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-12">
          <h1
            className="mb-4 font-bold tracking-[-0.02em]"
            style={{ fontSize: '3rem' }}
          >
            Campus Navigator
          </h1>
          <p className="text-lg text-slate-400">
            Interactive floor plans and classroom directory for IIT Kharagpur
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search for classroom (e.g., NR321)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800">
            <Navigation className="h-4 w-4" />
            Get Directions
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Building Selector */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
              <h3 className="mb-4 flex items-center gap-2 px-3 text-sm font-semibold text-slate-400">
                <Building2 className="h-4 w-4" />
                BUILDING
              </h3>
              <div className="space-y-1">
                {buildings.map((building) => (
                  <button
                    key={building.id}
                    onClick={() => setSelectedBuilding(building.id)}
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all ${
                      selectedBuilding === building.id
                        ? 'border-l-2 border-indigo-500 bg-indigo-500/10 text-slate-200'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
                    }`}
                  >
                    {building.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Floor Selector */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
              <h3 className="mb-4 flex items-center gap-2 px-3 text-sm font-semibold text-slate-400">
                <Layers className="h-4 w-4" />
                FLOOR
              </h3>
              <div className="space-y-1">
                {Array.from(
                  { length: currentBuilding?.floors || 3 },
                  (_, i) => i + 1
                ).map((floor) => (
                  <button
                    key={floor}
                    onClick={() => setSelectedFloor(floor)}
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all ${
                      selectedFloor === floor
                        ? 'bg-slate-800 text-slate-200'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
                    }`}
                  >
                    Floor {floor}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Details */}
            {selectedRoom && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <h3 className="mb-4 px-3 text-sm font-semibold text-slate-400">
                  ROOM DETAILS
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 text-2xl font-bold text-slate-200">
                      {selectedRoom.name}
                    </div>
                    <div className="text-sm text-slate-400">
                      {selectedRoom.type}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Users className="h-4 w-4" />
                    <span>Capacity: {selectedRoom.capacity} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        selectedRoom.status === 'available'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        selectedRoom.status === 'available'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {selectedRoom.status === 'available'
                        ? 'Available'
                        : 'Occupied'}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-800">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Facilities
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoom.facilities.map((facility) => (
                        <span
                          key={facility}
                          className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map Display */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-[inset_0_0_30px_rgba(99,102,241,0.03)]">
              {/* Floor Info */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {currentBuilding?.name} - Floor {selectedFloor}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {currentRooms.length} rooms on this floor
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-green-500/50" />
                    <span className="text-sm text-slate-400">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-red-500/50" />
                    <span className="text-sm text-slate-400">Occupied</span>
                  </div>
                </div>
              </div>

              {/* Room List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`rounded-lg border p-4 text-left transition-all ${
                      selectedRoom?.id === room.id
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold">{room.name}</span>
                      <div
                        className={`h-2 w-2 rounded-full ${
                          room.status === 'available'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      />
                    </div>
                    <div className="text-sm text-slate-400">{room.type}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {room.capacity} seats
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-sm text-slate-400">Total Rooms</div>
            <div className="mt-2 text-2xl font-bold">{classrooms.length}</div>
            <div className="mt-1 text-xs text-slate-500">in database</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-sm text-slate-400">Available Now</div>
            <div className="mt-2 text-2xl font-bold">
              {classrooms.filter((r) => r.status === 'available').length}
            </div>
            <div className="mt-1 text-xs text-green-500">ready to use</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-sm text-slate-400">Total Buildings</div>
            <div className="mt-2 text-2xl font-bold">{buildings.length}</div>
            <div className="mt-1 text-xs text-slate-500">mapped</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-sm text-slate-400">Total Capacity</div>
            <div className="mt-2 text-2xl font-bold">
              {classrooms.reduce((sum, r) => sum + r.capacity, 0)}
            </div>
            <div className="mt-1 text-xs text-slate-500">students</div>
          </div>
        </div>
      </div>
    </main>
  )
}
