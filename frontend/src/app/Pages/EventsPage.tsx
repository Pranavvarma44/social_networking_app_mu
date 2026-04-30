import React, { useMemo, useState } from "react"
import { Calendar, MapPin, Users } from "lucide-react"

type EventItem = {
  id: number
  title: string
  time: string
  location: string
  attendees: number
  tag: string
}

export default function EventsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [tag, setTag] = useState("Campus")

  const [events, setEvents] = useState<EventItem[]>([
    { id: 1, title: "Welcome Week Meetup", time: "Today · 5:30 PM", location: "Student Center", attendees: 86, tag: "Campus" },
    { id: 2, title: "Physics Finals Review", time: "Tomorrow · 6:00 PM", location: "Main Library", attendees: 34, tag: "Study" },
    { id: 3, title: "MU Basketball Game", time: "Fri · 7:00 PM", location: "Sports Arena", attendees: 214, tag: "Sports" },
  ])

  const nextId = useMemo(() => {
    const maxId = events.reduce((m, e) => Math.max(m, e.id), 0)
    return maxId + 1
  }, [events])

  const canCreate = title.trim() && time.trim() && location.trim()

  const submitEvent = () => {
    if (!canCreate) return
    setEvents((prev) => [
      {
        id: nextId,
        title: title.trim(),
        time: time.trim(),
        location: location.trim(),
        attendees: 0,
        tag,
      },
      ...prev,
    ])
    setTitle("")
    setTime("")
    setLocation("")
    setTag("Campus")
    setCreateOpen(false)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl">Events</h2>
          <p className="text-sm text-gray-500 mt-1">What’s happening around campus</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="bg-[#ff5757] text-white px-4 py-2 rounded-lg hover:bg-[#ff4545] transition-colors"
        >
          Create event
        </button>
      </div>

      {createOpen && (
        <div className="mb-6 border border-gray-800 rounded-xl p-5 bg-[#0d0d0d]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Create event</h3>
            <button onClick={() => setCreateOpen(false)} className="text-sm text-gray-400 hover:text-white">
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5757]"
            />
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="When (e.g. Fri · 7:00 PM)"
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5757]"
            />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5757]"
            />
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Tag</span>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#ff5757]"
              >
                <option>Campus</option>
                <option>Study</option>
                <option>Sports</option>
                <option>Club</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setCreateOpen(false)}
              className="px-4 py-2 bg-[#1a1a1a] rounded-lg text-sm hover:bg-[#252525] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submitEvent}
              disabled={!canCreate}
              className="px-4 py-2 bg-[#ff5757] text-white rounded-lg hover:bg-[#ff4545] transition-colors disabled:opacity-50 disabled:hover:bg-[#ff5757]"
            >
              Create
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {events.map((e) => (
          <div key={e.id} className="border border-gray-800 bg-[#0d0d0d] rounded-xl p-5 hover:bg-[#101010] transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-1 rounded-full bg-[#1a1a1a] text-gray-300">{e.tag}</span>
                  <span className="text-xs text-gray-600">·</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {e.time}
                  </span>
                </div>
                <h3 className="text-lg font-medium truncate">{e.title}</h3>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {e.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {e.attendees} going
                  </span>
                </div>
              </div>
              <button className="px-4 py-2 bg-[#1a1a1a] rounded-lg text-sm hover:bg-[#252525] transition-colors flex-shrink-0">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

