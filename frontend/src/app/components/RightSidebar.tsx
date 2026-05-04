import React, { useEffect, useState } from "react"
import axios from "axios"
import BASE_URL from "../../api"

export default function RightSidebar() {

  const [suggestions, setSuggestions] = useState<any[]>([])

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

    await axios.post(
  
      `${BASE_URL}/api/users/${id}/follow`,
  
      {},
  
      { headers: { Authorization: `Bearer ${token}` } }
  
    )
  
    fetchSuggestions() 
  
  }

  return (
    <div className="p-4 space-y-4">

      {/* 🔥 CLASSMATES */}
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
              className="bg-[#ff5757] px-3 py-1 rounded text-sm"
            >
              Add
            </button>
          </div>
        ))}

      </div>

    </div>
  )
}