'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function LoginButton() {
  return (
    <Button onClick={() => signIn('auth0')}>
      Iniciar sesión
    </Button>
  )
}