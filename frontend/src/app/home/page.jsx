"use client";
import { useUser } from "@/context/UserContext";

export default function HomePage() {
  const user = useUser().user;


  if (!user) {
    return (
      <div className="flex flex-col justify-center align-middle w-full h-full">
        <h3 className="text-2xl text-center font-bold">Загрузка пользовательских данных...</h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center align-middle w-full h-full">
      <h1 className="text-2xl text-center font-bold">Добро пожаловать, {user.email}!</h1>
    </div>
  );
}