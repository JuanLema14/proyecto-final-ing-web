import React from 'react';
import { LoginForm } from '@/components/custom/login-form';

const Index = () => {
  return (
    <div>
      <div className='flex h-screen items-center justify-center'>
        <div className='w-full max-w-sm'>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
