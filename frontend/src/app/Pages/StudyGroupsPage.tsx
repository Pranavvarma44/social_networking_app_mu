import { Plus, Search, Users } from "lucide-react"

type Group = {
  id: number
  name: string
  members: number
  topic: string
  nextMeet: string
}

export default function StudyGroupsPage() {
  const groups: Group[] = [
    { id: 1, name: "Physics 101", members: 14, topic: "Finals review + problem sets", nextMeet: "Today · 6:00 PM" },
    { id: 2, name: "DSA Practice", members: 23, topic: "LeetCode + mock interviews", nextMeet: "Thu · 7:30 PM" },
    { id: 3, name: "DBMS Project", members: 6, topic: "Schema + queries + testing", nextMeet: "Sat · 4:00 PM" },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl">Study Groups</h2>
          <p className="text-sm text-gray-500 mt-1">Find classmates and study together</p>
        </div>
        <button className="bg-[#ff5757] text-white px-4 py-2 rounded-lg hover:bg-[#ff4545] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create group
        </button>
      </div>

      <div className="mb-5">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            placeholder="Search study groups..."
            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#ff5757]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {groups.map((g) => (
          <div key={g.id} className="border border-gray-800 bg-[#0d0d0d] rounded-xl p-5 hover:bg-[#101010] transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-lg font-medium truncate">{g.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{g.topic}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {g.members} members
                  </span>
                  <span className="text-gray-500">Next meet: {g.nextMeet}</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-[#1a1a1a] rounded-lg text-sm hover:bg-[#252525] transition-colors flex-shrink-0">
                Join
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

