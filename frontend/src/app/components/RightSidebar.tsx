import React, { useEffect, useState } from "react"
import axios from "axios"
import BASE_URL from "../../api"

export default function RightSidebar() {

  const [suggestions, setSuggestions] = useState<any[]>([])
  const [followingIds, setFollowingIds] = useState<string[]>([])

  const token = localStorage.getItem("token")

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/users/suggestions`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setSuggestions(res.data)
    } catch (err) {
      console.error("SUGGESTIONS ERROR:", err)
    }
  }

  useEffect(() => {
    fetchSuggestions()
  }, [])

  const handleFollow = async (id: string) => {

    try {
  
      await axios.post(
  
        `${BASE_URL}/api/users/${id}/follow`,
  
        {},
  
        { headers: { Authorization: `Bearer ${token}` } }
  
      )
  
      setFollowingIds((prev) => [...prev, id])
  
      setTimeout(() => {
  
        setSuggestions((prev) => prev.filter((u) => u._id !== id))
  
        setFollowingIds((prev) => prev.filter((f) => f !== id))
  
      }, 1000)
  
    } catch (err) {
  
      console.error(err)
  
    }
  
  }
  return (
    <div className="p-4 space-y-4">
      <div className="bg-[#111] p-4 rounded-lg">
        <h3 className="mb-3 font-semibold">
          Classmates you might know
        </h3>

        {suggestions.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                {user.name?.[0]}
              </div>

              <div className="text-sm">
                {user.name}
              </div>
            </div>

            <button

              onClick={() => handleFollow(user._id)}

              className={`px-3 py-1 rounded text-sm transition ${

                followingIds.includes(user._id)

                  ? "bg-gray-600"

                  : "bg-[#ff5757] hover:bg-[#ff4545]"

              }`}

              disabled={followingIds.includes(user._id)}

            >

              {followingIds.includes(user._id) ? "Following" : "Add"}

            </button>
          </div>
        ))}

      </div>

    </div>
  )
}