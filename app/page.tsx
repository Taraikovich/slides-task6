'use client';

import { useState } from 'react';
import LoginForm from './ui/loginForm';
import Slides from './ui/slides';

export default function Home() {
  const [user, setUser] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const userName = formData.get('username');

    if (userName) setUser(userName as string);
  }

  return (
    <>{user ? <Slides user={user} /> : <LoginForm onSubmit={handleSubmit} />}</>
  );
}
