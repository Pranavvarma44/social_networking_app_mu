import React, { useEffect, useState } from "react"
import axios from "axios"
import BASE_URL from "../../api"
import { Briefcase, MapPin } from "lucide-react"

export default function OpportunitiesPage() {

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    type: "internship",
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<any>({})

  const [currentUser, setCurrentUser] = useState<any>(null)

  const token = localStorage.getItem("token")

  // ================= GET USER =================
  useEffect(() => {
    if (!token) return

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      setCurrentUser(payload)
    } catch {}
  }, [])

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      setLoading(true)

      const res = await axios.get(`${BASE_URL}/api/opportunities?limit=20`)

      setData(res.data.opportunities)

    } catch (err) {
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ================= CREATE =================
  const handleCreate = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/opportunities`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setShowForm(false)

      setForm({
        title: "",
        company: "",
        description: "",
        location: "",
        type: "internship",
      })

      fetchData()

    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.error || "Error creating opportunity")
    }
  }

  // ================= EDIT =================
  const handleEdit = async (id: string) => {
    try {
      await axios.put(
        `${BASE_URL}/api/opportunities/${id}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setEditingId(null)
      fetchData()

    } catch (err) {
      console.error(err)
    }
  }

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this opportunity?")) return

    try {
      await axios.delete(
        `${BASE_URL}/api/opportunities/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      fetchData()

    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Opportunities</h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-[#ff5757] px-4 py-2 rounded hover:bg-[#ff4545]"
        >
          + Post
        </button>
      </div>

      {/* CREATE FORM */}
      {showForm && (
        <div className="bg-[#111] p-4 rounded mb-6 space-y-3 border border-gray-800">

          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="w-full bg-[#1a1a1a] p-2 rounded"
          />

          <input
            placeholder="Company"
            value={form.company}
            onChange={(e) =>
              setForm({ ...form, company: e.target.value })
            }
            className="w-full bg-[#1a1a1a] p-2 rounded"
          />

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
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

          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
            className="w-full bg-[#1a1a1a] p-2 rounded"
          >
            <option value="internship">Internship</option>
            <option value="job">Job</option>
            <option value="research">Research</option>
            <option value="other">Other</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="bg-[#ff5757] px-4 py-2 rounded"
            >
              Post
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

      {/* LIST */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="space-y-4">

          {data.map((item) => {

            const currentUserId = currentUser?._id || currentUser?.userId

            const isOwner = item.postedBy?._id === currentUserId ||currentUser?.role === "admin"

            return (
              <div
                key={item._id}
                className="bg-[#111] p-4 rounded border border-gray-800"
              >

                {editingId === item._id ? (
                  <div className="space-y-2">

                    <input
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="w-full bg-[#1a1a1a] p-2 rounded"
                    />

                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                      className="w-full bg-[#1a1a1a] p-2 rounded"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item._id)}
                        className="bg-green-500 px-3 py-1 rounded"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-600 px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-lg">
                        {item.title}
                      </h3>

                      <span className="text-xs text-gray-400">
                        {item.type}
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm mt-2">
                      {item.description}
                    </p>

                    <div className="flex justify-between mt-3">

                      <div className="flex gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Briefcase size={14} />
                          {item.company}
                        </span>

                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {item.location || "Remote"}
                        </span>
                      </div>

                      {isOwner && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingId(item._id)
                              setEditForm(item)
                            }}
                            className="text-blue-400 text-sm"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-400 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}