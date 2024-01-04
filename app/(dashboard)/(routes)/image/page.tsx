"use client"
import Image from 'next/image';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function ImageComponent() {
  const [imageUrl, setImageUrl] = useState('');

  const genrateImage = async () => {
    try {
      console.log("sent");
      const response = await axios.get("http://localhost:3000/api/image",
        {
          responseType: "blob",
          params: {
            prompt : "a flock of birds flying over a river at sunrise with realistic textures."
          } 
        });
      console.log("Received");
      const blob = new Blob([response.data], { type: "image/jpeg" });
      console.log(blob);
      const url = URL.createObjectURL(blob);
      console.log(url);
      setImageUrl(url);
    } catch (error) {
      console.error('Error fetching the image', error);
    }
  };

  return (
    <div>
      <Image src={imageUrl} alt="Description" width={500} height={300} />
      <Button onClick={genrateImage}>Click me </Button>
    </div>
  );
}