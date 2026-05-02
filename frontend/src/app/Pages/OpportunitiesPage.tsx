import React, { useMemo, useState } from "react"
import { Briefcase, Building2, Clock, DollarSign, MapPin, Plus, X } from "lucide-react"

type Opportunity = {
  id: number
  title: string
  company: string
  location: string
  type: "Full-time" | "Part-time" | "Internship" | "Remote" | "Freelance"
  salary: string
  deadline: string
  description: string
  postedBy: string
  tags: string[]
}

const initialOpportunities: Opportunity[] = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechStartup Inc.",
    location: "San Francisco, CA",
    type: "Internship",
    salary: "$25/hr",
    deadline: "May 15, 2026",
    description: "Join our fast-growing startup and work on cutting-edge React projects alongside senior engineers.",
    postedBy: "Sarah Jenkins",
    tags: ["React", "TypeScript", "CSS"],
  },
  {
    id: 2,
    title: "Data Science Research Assistant",
    company: "MU Research Lab",
    location: "On Campus",
    type: "Part-time",
    salary: "$18/hr",
    deadline: "May 20, 2026",
    description: "Assist professors with ML research projects. Ideal for students with Python & statistics background.",
    postedBy: "Dr. Emily Wang",
    tags: ["Python", "ML", "Statistics"],
  },
  {
    id: 3,
    title: "Campus Ambassador",
    company: "LinkedIn",
    location: "Remote",
    type: "Remote",
    salary: "Commission-based",
    deadline: "June 1, 2026",
    description: "Represent LinkedIn on campus, host events and grow student engagement on the platform.",
    postedBy: "Jordan Smith",
    tags: ["Marketing", "Social Media", "Events"],
  },
]

const typeColors: Record<string, string> = {
  "Full-time": "bg-blue-500/20 text-blue-400",
  "Part-time": "bg-purple-500/20 text-purple-400",
  Internship: "bg-[#ff5757]/20 text-[#ff5757]",
  Remote: "bg-green-500/20 text-green-400",
  Freelance: "bg-yellow-500/20 text-yellow-400",
}

export default function OpportunitiesPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [company, setCompany] = useState("")
  const [location, setLocation] = useState("")
  const [type, setType] = useState<Opportunity["type"]>("Internship")
  const [salary, setSalary] = useState("")
  const [deadline, setDeadline] = useState("")
  const [description, setDescription] = useState("")
  const [tagsInput, setTagsInput] = useState("")
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities)
  const [filter, setFilter] = useState<string>("All")

  const nextId = useMemo(() => opportunities.reduce((m, o) => Math.max(m, o.id), 0) + 1, [opportunities])

  const canCreate = title.trim() && company.trim() && location.trim() && description.trim()

  const submitOpportunity = () => {
    if (!canCreate) return
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
    setOpportunities((prev) => [
      {
        id: nextId,
        title: title.trim(),
        company: company.trim(),
        location: location.trim(),
        type,
        salary: salary.trim() || "Negotiable",
        deadline: deadline.trim() || "Open",
        description: description.trim(),
        postedBy: "You",
        tags,
      },
      ...prev,
    ])
    setTitle(""); setCompany(""); setLocation(""); setSalary("")
    setDeadline(""); setDescription(""); setTagsInput("")
    setType("Internship"); setCreateOpen(false)
  }

  const filters = ["All", "Internship", "Part-time", "Full-time", "Remote", "Freelance"]
  const filtered = filter === "All" ? opportunities : opportunities.filter((o) => o.type === filter)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Opportunities</h2>
          <p className="text-sm text-gray-500 mt-1">Jobs, internships & campus gigs</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 bg-[#ff5757] text-white px-4 py-2 rounded-lg hover:bg-[#ff4545] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Post Opportunity
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              filter === f ? "bg-[#ff5757] text-white" : "bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Create Opportunity Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#ff5757]" />
                Post an Opportunity
              </h3>
              <button
                onClick={() => setCreateOpen(false)}
                className="p-1.5 hover:bg-[#1a1a1a] rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Job / Opportunity title *"
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5757] text-sm"
              />
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company / Organization *"
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5757] text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location *"
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5757] text-sm"
                />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as Opportunity["type"])}
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff5757] text-sm"
                >
                  <option>Internship</option>
                  <option>Part-time</option>
                  <option>Full-time</option>
                  <option>Remote</option>
                  <option>Freelance</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="Salary / Stipend"
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5757] text-sm"
                />
                <input
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="Application deadline"
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5757] text-sm"
                />
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the opportunity... *"
                rows={3}
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5757] text-sm resize-none"
              />
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Skills / tags (comma-separated, e.g. React, Python)"
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5757] text-sm"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setCreateOpen(false)}
                className="px-4 py-2 bg-[#1a1a1a] rounded-lg text-sm hover:bg-[#252525] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitOpportunity}
                disabled={!canCreate}
                className="px-5 py-2 bg-[#ff5757] text-white rounded-lg text-sm hover:bg-[#ff4545] transition-colors disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Opportunity Cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No opportunities yet in this category.</p>
          </div>
        )}
        {filtered.map((opp) => (
          <div
            key={opp.id}
            className="border border-gray-800 bg-[#0d0d0d] rounded-xl p-5 hover:bg-[#101010] hover:border-gray-700 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                {/* Type badge + deadline */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeColors[opp.type]}`}>
                    {opp.type}
                  </span>
                  <span className="text-xs text-gray-600">·</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Deadline: {opp.deadline}
                  </span>
                </div>

                <h3 className="text-lg font-semibold">{opp.title}</h3>

                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> {opp.company}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {opp.location}
                  </span>
                  {opp.salary && (
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" /> {opp.salary}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm text-gray-400 line-clamp-2">{opp.description}</p>

                {opp.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {opp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded bg-[#1a1a1a] text-gray-300 border border-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="mt-3 text-xs text-gray-600">Posted by {opp.postedBy}</p>
              </div>

              <div className="flex flex-col gap-2 flex-shrink-0">
                <button className="px-4 py-2 bg-[#ff5757] text-white rounded-lg text-sm hover:bg-[#ff4545] transition-colors">
                  Apply
                </button>
                <button className="px-4 py-2 bg-[#1a1a1a] text-gray-400 rounded-lg text-sm hover:bg-[#252525] hover:text-white transition-colors">
                  Save
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
