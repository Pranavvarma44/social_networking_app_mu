import React, { useEffect, useState } from "react"
import axios from "axios"
import BASE_URL from "../../api"
import { ArrowLeft, Users } from "lucide-react"

interface Props {
  groupId: string
  onBack: () => void
}

export default function GroupPage({ groupId, onBack }: Props) {

  const token = localStorage.getItem("token")

  const [group, setGroup] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // ================= CURRENT USER =================
  let currentUserId: string | null = null
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]))
      currentUserId = payload._id || payload.userId || payload.id
    }
  } catch {}

  // ================= FETCH GROUP =================
  const fetchGroup = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/study-groups/${groupId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setGroup(res.data)
    } catch (err) {
      console.error("FETCH GROUP ERROR:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGroup()
  }, [groupId])

  // ================= JOIN =================
  const handleJoin = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/study-groups/${groupId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchGroup()
    } catch (err) {
      console.error("JOIN ERROR:", err)
    }
  }

  // ================= LEAVE =================
  const handleLeave = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/study-groups/${groupId}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchGroup()
    } catch (err) {
      console.error("LEAVE ERROR:", err)
    }
  }

  // ================= REMOVE MEMBER (ADMIN) =================
  const handleRemove = async (userId: string) => {
    try {
      await axios.post(
        `${BASE_URL}/api/study-groups/${groupId}/remove`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchGroup()
    } catch (err) {
      console.error("REMOVE ERROR:", err)
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-400">Loading...</div>
  }

  if (!group) {
    return <div className="p-6 text-red-400">Group not found</div>
  }

  const members = group.members || []

  const isMember = members.some(
    (m: any) =>
      (m._id || m)?.toString() === currentUserId?.toString()
  )

  const isAdmin =
    (group.createdBy?._id || group.createdBy)?.toString() ===
    currentUserId?.toString()

  return (
    <div className="max-w-2xl mx-auto p-6">

      {/* BACK */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 mb-6"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* GROUP HEADER */}
      <div className="bg-[#111] p-5 rounded-xl border border-gray-800 mb-6">

        <h2 className="text-2xl font-semibold">{group.name}</h2>

        <p className="text-gray-400 mt-1">{group.subject}</p>

        <p className="text-gray-500 mt-2">{group.description}</p>

        <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
          <Users size={14} />
          {members.length} members
        </div>

        {/* JOIN / LEAVE */}
        <div className="mt-4">
          {isMember ? (
            <button
              onClick={handleLeave}
              className="bg-gray-600 px-4 py-2 rounded"
            >
              Leave Group
            </button>
          ) : (
            <button
              onClick={handleJoin}
              className="bg-[#ff5757] px-4 py-2 rounded"
            >
              Join Group
            </button>
          )}
        </div>
      </div>

      {/* MEMBERS LIST */}
      <div className="bg-[#111] p-5 rounded-xl border border-gray-800">

        <h3 className="text-lg font-semibold mb-4">Members</h3>

        <div className="space-y-3">

          {members.map((m: any) => {

            const memberId = (m._id || m).toString()

            return (
              <div
                key={memberId}
                className="flex justify-between items-center"
              >

                <div>
                  <p className="text-white">{m.name || "User"}</p>
                </div>

                {/* ADMIN REMOVE */}
                {isAdmin && memberId !== currentUserId && (
                  <button
                    onClick={() => handleRemove(memberId)}
                    className="text-red-400 text-sm"
                  >
                    Remove
                  </button>
                )}

              </div>
            )
          })}

        </div>
      </div>
    </div>
  )
}