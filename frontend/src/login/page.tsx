import { GalleryVerticalEnd } from "lucide-react"
import {LoginForm} from "@/components/login-form"
import image from "./image.svg?url"
export default function LoginPage() {
    return (
      <div className="grid min-h-svh grid-cols-2">
        {/* LEFT */}
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-start gap-2">
            <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full">
              <GalleryVerticalEnd className="h-4 w-4" />
            </div>
              MU SOCIAL.
            </a>
          </div>
  
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <LoginForm />
            </div>
          </div>
        </div>
  
        {/* RIGHT */}
        <div className="bg-muted relative">
        <img
  src={image}
  alt="Image"
  className="absolute top-6 right-6 w-64 md:w-80 object-contain"
/>
        </div>
      </div>
    )
  }