import { Code, ImageIcon, LayoutDashboard, MessagesSquare, Music, Settings, VideoIcon } from 'lucide-react'

const routes =[
    {
      label : "Dashboard",
      icon : LayoutDashboard,
      href : "/dashboard",
      color : "text-active_green",
      info : "Welcome to your Dashboard"
    },{
      label : "Conversation",
      icon : MessagesSquare,
      href : "/conversation",
      color : "text-blue",
      info : "Welcome to the most advanced AI Conversation"
    },{
      label : "Image Genration",
      icon : ImageIcon,
      href : "/image",
      color : "text-red",
      info : "Welcome to the most advanced AI Image Genration"
    },{
      label : "Video Genration",
      icon : VideoIcon,
      href : "/video",
      color : "text-orange",
      info : "Welcome to the most advanced AI Video Genration"
    },{
      label : "Music Genration",
      icon : Music,
      href : "/music",
      color : "text-yellow",
      info : "Welcome to the most advanced AI Music Genration"
    },{
      label : "Code Genration",
      icon : Code,
      href : "/code",
      color : "text-purple",
      info : "Welcome to the most advanced AI Code Genration"
    },{
      label : "Settings",
      icon : Settings,
      href : "/settings",
      color : "text-white",
      info : "Welcome to the Settings"
    }
  ]

  export default routes;