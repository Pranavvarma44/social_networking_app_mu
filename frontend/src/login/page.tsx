import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import image from "./image.svg?url"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black p-6">

      {/* TOP LEFT LOGO */}
      <div className="absolute top-6 left-6 flex items-center gap-2 font-medium text-white">
        <div className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-full">
          <GalleryVerticalEnd className="h-3.5 w-3.5" />
        </div>
        MU SOCIAL.
      </div>

      {/* CENTER LOGIN FORM */}
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>

      {/* MAHINDRA LOGO TOP RIGHT */}
      <img
        src={image}
        alt="Mahindra University"
        className="absolute top-10 right-10 h-36 w-36 rounded-full object-cover shadow-lg"
      />

    </div>
  )
}