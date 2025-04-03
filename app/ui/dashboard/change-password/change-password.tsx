"use client";

import React, { useState } from 'react';
import { changePassword } from '@/app/lib/actions';

export default function ChangePasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    try {
      const result = await changePassword(new FormData(event.currentTarget));
      if (result.success) {
        setSuccess(true);
        setError(null);
      }
    } catch (err: any) {
      setError(err.message);
      setSuccess(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {success ? (
        <div className="p-3 mb-4 text-green-700 bg-green-100 rounded-lg">
          Password changed successfully!
        </div>
      ) : (
        <>
          <div>
            <label className="block mb-2 text-sm font-medium">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              required
              className="w-full p-2 border rounded-md"
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              required
              minLength={6}
              className="w-full p-2 border rounded-md"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              className="w-full p-2 border rounded-md"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Change Password
          </button>
        </>
      )}
    </form>
  );
}
