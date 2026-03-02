import { GalleryVerticalEnd } from "lucide-react"
import {RegisterForm} from "@/components/register-form"
import image from "./image.svg?url"
export default function RegisterPage() {
    return (
      <div className="grid min-h-svh grid-cols-2">
        {/* LEFT */}
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-start gap-2">
            <a href="#" className="flex items-center gap-2 font-medium">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-4" />
              </div>
              MU SOCIAL.
            </a>
          </div>
  
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <RegisterForm />
            </div>
          </div>
        </div>
  
        {/* RIGHT */}
        <div className="bg-muted relative">
        <img
  src={image}
  alt="Image"
  className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] object-contain"
/>
        </div>
      </div>
    )
  }