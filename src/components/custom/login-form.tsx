// /src/components/custom/login-form.tsx
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      router.push('/');
    } else {
      setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
    }
  };

  return (
      <form onSubmit={handleSubmit} className={cn('flex flex-col gap-6', className)} {...props}>
        <div className='flex flex-col items-center gap-2 text-center'>
          <h1 className='text-2xl font-bold'>Inicia sesión</h1>
          <p className='text-balance text-sm text-muted-foreground'>
            Ingresa tu email y contraseña para acceder.
          </p>
        </div>
        <div className='grid gap-6'>
          <div className='grid gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' type='email' placeholder='m@example.com' required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='password'>Contraseña</Label>
            <Input id='password' type='password' required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className='text-center text-sm text-red-500'>{error}</p>}
          <Button type='submit' className='w-full'>
            Login
          </Button>
        </div>
      </form>
  );
}