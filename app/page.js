"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const persons = [
    {
      id: "hitesh",
      name: "Hitesh Choudhary",
      img: "/hitesh.jpg",
      role: "Educator, Founder of Chai aur Code",
      bio: "Helping devs learn faster with real-world projects & chai ☕.",
    },
    {
      id: "piyush",
      name: "Piyush Garg",
      img: "/piyush.jpeg",
      role: "Full-Stack Developer",
      bio: "Loves solving problems, creating awesome UIs, and mentoring devs.",
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Choose a person to chat with 💬</h1>

      <div className="grid gap-6 sm:grid-cols-2">
        {persons.map((p) => (
          <Card
            key={p.id}
            className="w-80 hover:shadow-lg transition cursor-pointer"
            onClick={() => router.push(`/chat/${p.id}`)}
          >
            <CardHeader className="flex flex-col items-center">
              <Avatar className="w-20 h-20">
                <AvatarImage src={p.img} alt={p.name} />
                <AvatarFallback>{p.name[0]}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4 text-center">{p.name}</CardTitle>
              <CardDescription className="text-center">{p.role}</CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-gray-600 text-center">{p.bio}</p>
              <Button className="w-full mt-4 border border-gray-200" variant="default">
                Start Chat
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
