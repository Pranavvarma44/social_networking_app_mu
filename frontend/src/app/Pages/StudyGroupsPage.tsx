import { Plus, Search, Users } from "lucide-react"
import React,{ useEffect, useState } from "react"
import axios from "axios"
import BASE_URL from "../../api"

export default function StudyGroupsPage() {

  const [groups, setGroups] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    name: "",
    description: "",
    subject: "",
  })

  const token = localStorage.getItem("token")

  let currentUserId: string | null = null
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]))
      currentUserId = payload._id || payload.userId
    }
  } catch {}

  // ================= FETCH =================
  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/study-groups`)
      setGroups(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  // ================= CREATE =================
  const handleCreate = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/study-groups`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setShowForm(false)
      setForm({ name: "", description: "", subject: "" })
      fetchGroups()
    } catch (err) {
      console.error(err)
    }
  }

  // ================= JOIN =================
  const handleJoin = async (id: string) => {
    await axios.post(
      `${BASE_URL}/api/study-groups/${id}/join`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    fetchGroups()
  }

  // ================= LEAVE =================
  const handleLeave = async (id: string) => {
    await axios.post(
      `${BASE_URL}/api/study-groups/${id}/leave`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    fetchGroups()
  }

  // ================= SEARCH FILTER =================
  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl">Study Groups</h2>
          <p className="text-sm text-gray-500 mt-1">
            Find classmates and study together
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-[#ff5757] text-white px-4 py-2 rounded-lg hover:bg-[#ff4545] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create group
        </button>
      </div>

      {/* CREATE FORM */}
      {showForm && (
        <div className="bg-[#111] p-4 rounded mb-6 space-y-3 border border-gray-800">

          <input
            placeholder="Group name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full bg-[#1a1a1a] p-2 rounded"
          />

          <input
            placeholder="Subject"
            value={form.subject}
            onChange={(e) =>
              setForm({ ...form, subject: e.target.value })
            }
            className="w-full bg-[#1a1a1a] p-2 rounded"
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full bg-[#1a1a1a] p-2 rounded"
          />

          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="bg-[#ff5757] px-4 py-2 rounded"
            >
              Create
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* SEARCH */}
      <div className="mb-5">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            placeholder="Search study groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#ff5757]"
          />
        </div>
      </div>

      {/* GROUP LIST */}
      <div className="grid grid-cols-1 gap-4">
        {filteredGroups.map((g) => {

          const isMember = g.members.some(
            (m: any) => (m._id || m) === currentUserId
          )

          return (
            <div
              key={g._id}
              className="border border-gray-800 bg-[#0d0d0d] rounded-xl p-5 hover:bg-[#101010]"
            >

              <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">
                  <h3 className="text-lg font-medium">{g.name}</h3>

                  <p className="text-sm text-gray-400 mt-1">
                    {g.subject}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {g.description}
                  </p>

                  <div className="mt-3 flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {g.members.length} members
                    </span>
                  </div>
                </div>

                {isMember ? (
                  <button
                    onClick={() => handleLeave(g._id)}
                    className="px-4 py-2 bg-gray-600 rounded-lg text-sm"
                  >
                    Leave
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoin(g._id)}
                    className="px-4 py-2 bg-[#ff5757] rounded-lg text-sm"
                  >
                    Join
                  </button>
                )}

              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}