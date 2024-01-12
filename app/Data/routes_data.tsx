import { Code, ImageIcon, LayoutDashboard, MessagesSquare, Music, Settings, VideoIcon } from 'lucide-react'

const routes =[
    {
      label : "Dashboard",
      icon : LayoutDashboard,
      href : "/dashboard",
      color : "green",
      bgColor : "bg-green/20",
      info : "Chat with the Smartest AI - Experience the power of AI",
      isDashboardVisible : false
    },{
      label : "Conversation",
      icon : MessagesSquare,
      href : "/conversation",
      color : "blue",
      bgColor : "bg-blue/20",
      info : "Welcome to the most advanced AI Conversation",
      isDashboardVisible : true
    },{
      label : "Image Genration",
      icon : ImageIcon,
      href : "/image",
      color : "red",
      bgColor : "bg-red/20",
      info : "Welcome to the most advanced AI Image Genration",
      isDashboardVisible : true
    },{
      label : "Music Genration",
      icon : Music,
      href : "/music",
      color : "yellow",
      bgColor : "bg-yellow/20",
      info : "Welcome to the most advanced AI Music Genration",
      isDashboardVisible : true
    }
  ]

  export default routes;