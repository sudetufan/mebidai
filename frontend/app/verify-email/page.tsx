"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function VerifyEmailPage() {
  const [message, setMessage] = useState("Email doğrulanıyor...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setMessage("Geçersiz doğrulama linki.");
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/users/verify-email?token=${token}`
        );

        const data = await response.json();

        if (response.ok) {
          setSuccess(true);
          setMessage(data.message);
        } else {
          setMessage(data.detail || "Email doğrulama başarısız.");
        }
      } catch (error) {
        setMessage("Sunucuya bağlanırken hata oluştu.");
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md">
        {success ? (
          <>
            <div className="text-5xl mb-4">✅</div>

            <h1 className="text-2xl font-bold mb-3">
              Email Doğrulandı
            </h1>

            <p className="text-gray-600 mb-6">
              {message}
            </p>

            <Link
              href="/login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Giriş Yap
            </Link>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">📩</div>

            <h1 className="text-2xl font-bold mb-3">
              Email Doğrulama
            </h1>

            <p className="text-gray-600">
              {message}
            </p>
          </>
        )}
      </div>
    </div>
  );
}